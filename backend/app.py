import os
from flask import Flask, jsonify, request, session
from flask_cors import CORS
import mysql.connector
from mysql.connector import Error as DBError # Alias to avoid conflict if any
from db_config import get_db_connection, create_admin_table, seed_initial_admins
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
from flask_bcrypt import Bcrypt
from dotenv import load_dotenv

load_dotenv() # Load environment variables from .env

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('FLASK_SECRET_KEY', 'default_dev_secret_key_change_me')
# Adjust origins for your frontend development server and production domain
CORS(app, supports_credentials=True, origins=os.environ.get('CORS_ORIGINS', 'http://localhost:5173').split(','))

bcrypt = Bcrypt(app)
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.session_protection = "strong"

# --- Admin User Model (Database-backed) ---
class Admin(UserMixin):
    def __init__(self, id, username):
        self.id = id
        self.username = username

    @staticmethod
    def get_by_id(user_id):
        connection = get_db_connection()
        if not connection:
            return None
        try:
            cursor = connection.cursor(dictionary=True)
            cursor.execute("SELECT id, username FROM admins WHERE id = %s", (user_id,))
            user_data = cursor.fetchone()
            if user_data:
                return Admin(id=user_data['id'], username=user_data['username'])
            return None
        except DBError as err:
            app.logger.error(f"Error fetching admin by ID: {err}")
            return None
        finally:
            if connection and connection.is_connected():
                cursor.close()
                connection.close()

    @staticmethod
    def get_by_username(username):
        connection = get_db_connection()
        if not connection:
            return None
        try:
            cursor = connection.cursor(dictionary=True)
            cursor.execute("SELECT id, username, password_hash FROM admins WHERE username = %s", (username,))
            user_data = cursor.fetchone()
            if user_data:
                # Return full data including hash for login check
                return user_data 
            return None
        except DBError as err:
            app.logger.error(f"Error fetching admin by username: {err}")
            return None
        finally:
            if connection and connection.is_connected():
                cursor.close()
                connection.close()

@login_manager.user_loader
def load_user(user_id):
    return Admin.get_by_id(user_id)

@login_manager.unauthorized_handler
def unauthorized():
    # For API, return 401 instead of redirecting
    return jsonify(message="Authentication required. Please log in."), 401

# Initialize DB and seed admins (run once on startup)
with app.app_context():
    print("Initializing database for admin users...")
    create_admin_table()
    seed_initial_admins(bcrypt) # Pass the bcrypt instance
    print("Admin database initialization complete.")

# --- Admin API Endpoints ---
@app.route('/api/admin/login', methods=['POST'])
def admin_login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400

    admin_data = Admin.get_by_username(username)

    if admin_data and bcrypt.check_password_hash(admin_data['password_hash'], password):
        admin_user = Admin(id=admin_data['id'], username=admin_data['username'])
        login_user(admin_user) # Manages session
        return jsonify({"message": "Login successful", "user": {"id": admin_user.id, "username": admin_user.username}}), 200
    else:
        return jsonify({"error": "Invalid username or password"}), 401

@app.route('/api/admin/logout', methods=['POST'])
@login_required # Ensures only logged-in users can logout
def admin_logout():
    logout_user() # Clears the session
    return jsonify({"message": "Logout successful"}), 200

@app.route('/api/admin/authcheck', methods=['GET'])
@login_required
def admin_authcheck():
    # If @login_required passes, user is authenticated
    return jsonify({
        "is_authenticated": True,
        "user": {"id": current_user.id, "username": current_user.username}
    }), 200


@app.route('/api/businesses', methods=['GET'])
def get_businesses():
    """
    Get all businesses, optionally filtered by category and/or a search term.
    """
    category = request.args.get('category', '')
    search_term = request.args.get('q', '')  # New search term parameter
    limit = request.args.get('limit', 20, type=int)
    offset = request.args.get('offset', 0, type=int)
    
    connection = get_db_connection()
    if not connection:
        return jsonify({"error": "Database connection failed"}), 500
    
    try:
        cursor = connection.cursor(dictionary=True)
        
        query_parts = ["SELECT * FROM businesses"]
        where_clauses = []
        params_for_data = [] # Parameters for the main data query
        params_for_count = [] # Parameters for the count query
        
        if category:
            where_clauses.append("category = %s")
            params_for_data.append(category)
            params_for_count.append(category)
        
        if search_term:
            search_param = f"%{search_term}%"
            where_clauses.append("(business_name LIKE %s OR description LIKE %s)")
            params_for_data.extend([search_param, search_param])
            params_for_count.extend([search_param, search_param])
            
        if where_clauses:
            query_parts.append("WHERE " + " AND ".join(where_clauses))
        
        # Construct and execute the count query first
        count_query_sql = "SELECT COUNT(*) as total FROM businesses"
        if where_clauses:
            count_query_sql += " WHERE " + " AND ".join(where_clauses)
        
        cursor.execute(count_query_sql, tuple(params_for_count))
        total = cursor.fetchone()['total']
        
        # Construct and execute the main data query
        query_parts.append("ORDER BY business_name LIMIT %s OFFSET %s")
        params_for_data.extend([limit, offset])
        
        main_query_sql = " ".join(query_parts)
        cursor.execute(main_query_sql, tuple(params_for_data))
        businesses = cursor.fetchall()
        
        return jsonify({
            "businesses": businesses,
            "total": total,
            "limit": limit,
            "offset": offset,
            "category_filter": category,
            "search_term": search_term
        })
        
    except Error as err:
        app.logger.error(f"Database error: {err}") # Added logging
        return jsonify({"error": str(err)}), 500
    finally:
        if connection and connection.is_connected():
            cursor.close()
            connection.close()

@app.route('/api/businesses/featured', methods=['GET'])
def get_featured_businesses():
    """
    Get featured businesses
    """
    limit = request.args.get('limit', 6, type=int)
    
    connection = get_db_connection()
    if not connection:
        return jsonify({"error": "Database connection failed"}), 500
    
    try:
        cursor = connection.cursor(dictionary=True)
        
        # Query for featured businesses
        query = "SELECT * FROM businesses WHERE featured = TRUE ORDER BY business_name LIMIT %s"
        cursor.execute(query, (limit,))
        featured = cursor.fetchall()
        
        # If no featured businesses are set, return some random ones
        if not featured:
            query = "SELECT * FROM businesses ORDER BY RAND() LIMIT %s"
            cursor.execute(query, (limit,))
            featured = cursor.fetchall()
        
        return jsonify(featured)
        
    except Error as err:
        return jsonify({"error": str(err)}), 500
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()

@app.route('/api/categories', methods=['GET'])
def get_categories():
    """
    Get all business categories
    """
    connection = get_db_connection()
    if not connection:
        return jsonify({"error": "Database connection failed"}), 500
    
    try:
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM categories ORDER BY name")
        categories = cursor.fetchall()
        return jsonify(categories)
        
    except Error as err:
        return jsonify({"error": str(err)}), 500
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()

@app.route('/api/businesses/search', methods=['GET'])
def search_businesses():
    """
    Search businesses by name, description, or category
    """
    search_term = request.args.get('q', '')
    limit = request.args.get('limit', 20, type=int)
    offset = request.args.get('offset', 0, type=int)
    
    if not search_term:
        return jsonify({"error": "Search term is required"}), 400
    
    connection = get_db_connection()
    if not connection:
        return jsonify({"error": "Database connection failed"}), 500
    
    try:
        cursor = connection.cursor(dictionary=True)
        
        # Search query with LIKE for partial matches
        search_param = f"%{search_term}%"
        query = """
        SELECT * FROM businesses 
        WHERE business_name LIKE %s 
        OR description LIKE %s 
        OR category LIKE %s 
        ORDER BY business_name
        LIMIT %s OFFSET %s
        """
        cursor.execute(query, (search_param, search_param, search_param, limit, offset))
        results = cursor.fetchall()
        
        # Get total count for pagination
        count_query = """
        SELECT COUNT(*) as total FROM businesses 
        WHERE business_name LIKE %s 
        OR description LIKE %s 
        OR category LIKE %s
        """
        cursor.execute(count_query, (search_param, search_param, search_param))
        total = cursor.fetchone()['total']
        
        return jsonify({
            "businesses": results,
            "total": total,
            "limit": limit,
            "offset": offset
        })
        
    except Error as err:
        return jsonify({"error": str(err)}), 500
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()

@app.route('/api/businesses/set-featured', methods=['POST'])
def set_featured_business():
    """
    Set a business as featured
    """
    data = request.get_json()
    business_id = data.get('id')
    featured = data.get('featured', True)
    
    if not business_id:
        return jsonify({"error": "Business ID is required"}), 400
    
    connection = get_db_connection()
    if not connection:
        return jsonify({"error": "Database connection failed"}), 500
    
    try:
        cursor = connection.cursor()
        query = "UPDATE businesses SET featured = %s WHERE id = %s"
        cursor.execute(query, (featured, business_id))
        connection.commit()
        
        return jsonify({"success": True, "message": "Featured status updated"})
        
    except Error as err:
        return jsonify({"error": str(err)}), 500
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()

if __name__ == '__main__':
    app.run(debug=True, port=5000)
