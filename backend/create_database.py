import mysql.connector
from mysql.connector import Error
from db_config import config

def create_database():
    """
    Creates the MySQL database and tables needed for the Maryland business directory
    """
    # First connect without specifying a database
    db_config = config.copy()
    db_config.pop('database', None)
    db_config.pop('raise_on_warnings', None)
    
    # Initialize connection as None to avoid UnboundLocalError
    connection = None
    
    try:
        # Create a connection to MySQL server
        print("Connecting to MySQL server...")
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor()
        
        # Create the database if it doesn't exist
        cursor.execute(f"CREATE DATABASE IF NOT EXISTS {config['database']}")
        print(f"Database '{config['database']}' created or already exists.")
        
        # Close the connection to MySQL server
        cursor.close()
        connection.close()
        
        # Connect to the newly created database
        print("Connecting to the database...")
        connection = mysql.connector.connect(**config)
        cursor = connection.cursor()
        
        # Create the businesses table
        create_businesses_table = """
        CREATE TABLE IF NOT EXISTS businesses (
            id INT AUTO_INCREMENT PRIMARY KEY,
            business_name VARCHAR(255) NOT NULL,
            location TEXT,
            contact_name VARCHAR(255),
            tel VARCHAR(50),
            email VARCHAR(255),
            description TEXT,
            website VARCHAR(255),
            category VARCHAR(100),
            featured BOOLEAN DEFAULT FALSE,
            date_added TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        """
        cursor.execute(create_businesses_table)
        print("Table 'businesses' created or already exists.")
        
        # Create the categories table for easier filtering
        create_categories_table = """
        CREATE TABLE IF NOT EXISTS categories (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) UNIQUE NOT NULL
        )
        """
        cursor.execute(create_categories_table)
        print("Table 'categories' created or already exists.")
        
        # Commit the changes
        connection.commit()
        print("Database setup completed successfully!")
        
    except Error as err:
        print(f"Error: {err}")
    finally:
        if connection is not None and connection.is_connected():
            cursor.close()
            connection.close()
            print("MySQL connection closed.")

if __name__ == "__main__":
    create_database()
