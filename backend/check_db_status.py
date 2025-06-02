"""
Script to check if businesses are already in the database
"""
from db_config import get_db_connection

def check_database_status():
    """Check if businesses and categories exist in the database"""
    connection = get_db_connection()
    if not connection:
        print("Failed to connect to the database. Please check your credentials.")
        return
    
    try:
        cursor = connection.cursor(dictionary=True)
        
        # Check if businesses table exists and has data
        try:
            cursor.execute("SELECT COUNT(*) as count FROM businesses")
            result = cursor.fetchone()
            business_count = result['count']
            print(f"Number of businesses in database: {business_count}")
            
            # Show some sample businesses if there are any
            if business_count > 0:
                cursor.execute("SELECT business_name, category FROM businesses LIMIT 5")
                businesses = cursor.fetchall()
                print("\nSample businesses:")
                for business in businesses:
                    print(f"- {business['business_name']} ({business['category']})")
            
            # Check categories
            cursor.execute("SELECT COUNT(*) as count FROM categories")
            result = cursor.fetchone()
            category_count = result['count']
            print(f"\nNumber of categories in database: {category_count}")
            
            if category_count > 0:
                cursor.execute("SELECT name FROM categories LIMIT 5")
                categories = cursor.fetchall()
                print("\nSample categories:")
                for category in categories:
                    print(f"- {category['name']}")
                    
        except Exception as e:
            print(f"Error querying tables: {e}")
            print("The database exists but tables might not be created yet.")
            print("Run 'python create_database.py' to create tables.")
            
    except Exception as e:
        print(f"Error: {e}")
    finally:
        if connection and connection.is_connected():
            cursor.close()
            connection.close()
            print("\nMySQL connection closed.")

if __name__ == "__main__":
    check_database_status()
