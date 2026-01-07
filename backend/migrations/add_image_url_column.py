import mysql.connector
from mysql.connector import Error
import sys
import os

# Add parent directory to path to import db_config
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from db_config import get_db_connection

def add_image_url_column():
    """
    Migration script to add image_url column to businesses and business_applications tables.
    This allows storing the path/URL to uploaded business images.
    """
    connection = get_db_connection()
    if not connection:
        print("❌ Failed to connect to database. Migration aborted.")
        return False

    try:
        cursor = connection.cursor()
        
        # Check if businesses table exists and add image_url column
        print("📋 Checking businesses table...")
        cursor.execute("""
            SELECT COUNT(*) 
            FROM information_schema.COLUMNS 
            WHERE TABLE_SCHEMA = DATABASE() 
            AND TABLE_NAME = 'businesses' 
            AND COLUMN_NAME = 'image_url'
        """)
        
        if cursor.fetchone()[0] == 0:
            print("➕ Adding image_url column to businesses table...")
            cursor.execute("""
                ALTER TABLE businesses 
                ADD COLUMN image_url VARCHAR(500) NULL AFTER description
            """)
            print("✅ Successfully added image_url column to businesses table")
        else:
            print("ℹ️  image_url column already exists in businesses table")

        # Check if business_applications table exists
        cursor.execute("""
            SELECT COUNT(*) 
            FROM information_schema.TABLES 
            WHERE TABLE_SCHEMA = DATABASE() 
            AND TABLE_NAME = 'business_applications'
        """)
        
        if cursor.fetchone()[0] > 0:
            # Table exists, check for image_url column
            cursor.execute("""
                SELECT COUNT(*) 
                FROM information_schema.COLUMNS 
                WHERE TABLE_SCHEMA = DATABASE() 
                AND TABLE_NAME = 'business_applications' 
                AND COLUMN_NAME = 'image_url'
            """)
            
            if cursor.fetchone()[0] == 0:
                print("➕ Adding image_url column to business_applications table...")
                cursor.execute("""
                    ALTER TABLE business_applications 
                    ADD COLUMN image_url VARCHAR(500) NULL AFTER description
                """)
                print("✅ Successfully added image_url column to business_applications table")
            else:
                print("ℹ️  image_url column already exists in business_applications table")
        else:
            print("ℹ️  business_applications table does not exist yet, skipping...")

        connection.commit()
        print("\n✅ Migration completed successfully!")
        return True

    except Error as err:
        print(f"❌ Error during migration: {err}")
        connection.rollback()
        return False
    finally:
        if connection and connection.is_connected():
            cursor.close()
            connection.close()
            print("🔌 Database connection closed.")

if __name__ == "__main__":
    print("=" * 60)
    print("🚀 Starting Database Migration: Add image_url Column")
    print("=" * 60)
    success = add_image_url_column()
    sys.exit(0 if success else 1)
