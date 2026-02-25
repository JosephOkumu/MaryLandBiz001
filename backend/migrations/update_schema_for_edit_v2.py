import mysql.connector
from mysql.connector import Error
import os
import sys

# Add parent directory to path so we can import from db_config
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from db_config import get_db_connection

def migrate():
    connection = get_db_connection()
    if not connection:
        print("Could not connect to database.")
        return

    try:
        cursor = connection.cursor()
        
        # 1. Update businesses table
        print("Migrating businesses table...")
        
        # Get existing columns
        cursor.execute("DESCRIBE businesses")
        columns = [col[0] for col in cursor.fetchall()]
        
        # Rename 'name' to 'business_name' if it exists
        if 'name' in columns and 'business_name' not in columns:
            print("Renaming 'name' to 'business_name'...")
            cursor.execute("ALTER TABLE businesses CHANGE COLUMN name business_name VARCHAR(255) NOT NULL")
        
        # Rename 'contact_phone' to 'tel' if it exists
        if 'contact_phone' in columns and 'tel' not in columns:
            print("Renaming 'contact_phone' to 'tel'...")
            cursor.execute("ALTER TABLE businesses CHANGE COLUMN contact_phone tel VARCHAR(20)")
            
        # Rename 'contact_email' to 'email' if it exists
        if 'contact_email' in columns and 'email' not in columns:
            print("Renaming 'contact_email' to 'email'...")
            cursor.execute("ALTER TABLE businesses CHANGE COLUMN contact_email email VARCHAR(100)")

        # Add image_url if not exists
        if 'image_url' not in columns:
            print("Adding 'image_url' column...")
            cursor.execute("ALTER TABLE businesses ADD COLUMN image_url VARCHAR(255)")

        # Add featured if not exists
        if 'featured' not in columns:
            print("Adding 'featured' column...")
            cursor.execute("ALTER TABLE businesses ADD COLUMN featured BOOLEAN DEFAULT FALSE")

        # Add date_added if not exists
        if 'date_added' not in columns:
            print("Adding 'date_added' column...")
            cursor.execute("ALTER TABLE businesses ADD COLUMN date_added TIMESTAMP DEFAULT CURRENT_TIMESTAMP")

        # 2. Update business_applications table
        print("Migrating business_applications table...")
        
        # Check if table exists
        cursor.execute("SHOW TABLES LIKE 'business_applications'")
        table_exists = cursor.fetchone()
        
        if table_exists:
            cursor.execute("DESCRIBE business_applications")
            app_columns = [col[0] for col in cursor.fetchall()]
            
            if 'application_type' not in app_columns:
                print("Adding 'application_type' to business_applications...")
                cursor.execute("ALTER TABLE business_applications ADD COLUMN application_type ENUM('new', 'edit') DEFAULT 'new'")
            
            if 'business_id' not in app_columns:
                print("Adding 'business_id' to business_applications...")
                cursor.execute("ALTER TABLE business_applications ADD COLUMN business_id INT NULL")
        else:
            print("business_applications table does not exist yet. It will be created by app.py.")

        connection.commit()
        print("Migration completed successfully!")

    except Error as e:
        print(f"Error during migration: {e}")
        connection.rollback()
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()

if __name__ == "__main__":
    migrate()
