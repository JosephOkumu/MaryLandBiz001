import os
import mysql.connector
from mysql.connector import Error # Added Error for more specific exception handling
from dotenv import load_dotenv
# We will import and use flask_bcrypt in app.py and pass the bcrypt object
# or directly use it here if this script is run standalone for setup.
# For now, we'll design seed_initial_admins to accept a bcrypt object.

# Load environment variables from .env file
load_dotenv()

# Database configuration
config = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'user': os.getenv('DB_USER', 'root'),
    'password': os.getenv('DB_PASSWORD', ''),
    'database': os.getenv('DB_NAME', 'maryland_businesses'),
    'raise_on_warnings': True
}

def get_db_connection():
    """
    Creates and returns a connection to the MySQL database
    """
    try:
        print("Attempting to connect to MySQL database...")
        connection = mysql.connector.connect(**config)
        print("Successfully connected to the database!")
        return connection
    except mysql.connector.Error as err:
        print(f"Error connecting to the database: {err}")
        return None

def create_admin_table():
    """
    Creates the 'admins' table in the database if it doesn't already exist.
    """
    connection = get_db_connection()
    if not connection:
        print("Failed to connect to database. Admin table not created.")
        return

    try:
        cursor = connection.cursor()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS admins (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(80) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        connection.commit()
        print("Admin table checked/created successfully.")
    except Error as err:
        print(f"Error creating admin table: {err}")
    finally:
        if connection and connection.is_connected():
            cursor.close()
            connection.close()

def seed_initial_admins(bcrypt_instance):
    """
    Seeds the database with initial admin users if they don't already exist.
    Requires a bcrypt instance for password hashing.
    """
    admins_to_seed = [
        {"username": "admin1"},
        {"username": "admin2"},
        {"username": "admin3"}
    ]
    password_to_hash = "Ha$h3d01"
    hashed_password = bcrypt_instance.generate_password_hash(password_to_hash).decode('utf-8')

    connection = get_db_connection()
    if not connection:
        print("Failed to connect to database. Admins not seeded.")
        return

    try:
        cursor = connection.cursor()
        for admin_data in admins_to_seed:
            # Check if admin already exists
            cursor.execute("SELECT id FROM admins WHERE username = %s", (admin_data['username'],))
            if cursor.fetchone():
                print(f"Admin user '{admin_data['username']}' already exists. Skipping.")
            else:
                cursor.execute("INSERT INTO admins (username, password_hash) VALUES (%s, %s)", 
                               (admin_data['username'], hashed_password))
                print(f"Admin user '{admin_data['username']}' created.")
        connection.commit()
    except Error as err:
        print(f"Error seeding admin users: {err}")
    finally:
        if connection and connection.is_connected():
            cursor.close()
            connection.close()
