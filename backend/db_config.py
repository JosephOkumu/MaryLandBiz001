import os
import mysql.connector
from dotenv import load_dotenv

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
