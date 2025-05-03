from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector
from mysql.connector import Error
from db_config import get_db_connection

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/api/businesses', methods=['GET'])
def get_businesses():
    """
    Get all businesses or filtered by category
    """
    category = request.args.get('category', '')
    limit = request.args.get('limit', 20, type=int)
    offset = request.args.get('offset', 0, type=int)
    
    connection = get_db_connection()
    if not connection:
        return jsonify({"error": "Database connection failed"}), 500
    
    try:
        cursor = connection.cursor(dictionary=True)
        
        # Base query
        query = "SELECT * FROM businesses"
        params = []
        
        # Add category filter if provided
        if category:
            query += " WHERE category = %s"
            params.append(category)
        
        # Add pagination
        query += " ORDER BY business_name LIMIT %s OFFSET %s"
        params.extend([limit, offset])
        
        cursor.execute(query, params)
        businesses = cursor.fetchall()
        
        # Get total count for pagination
        count_query = "SELECT COUNT(*) as total FROM businesses"
        count_params = []
        
        if category:
            count_query += " WHERE category = %s"
            count_params.append(category)
            
        cursor.execute(count_query, count_params)
        total = cursor.fetchone()['total']
        
        return jsonify({
            "businesses": businesses,
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
