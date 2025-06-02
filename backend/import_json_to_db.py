import os
import json
import mysql.connector
from mysql.connector import Error
from db_config import get_db_connection

def import_json_data():
    """
    Imports JSON data from the parsed_businesses directory into the MySQL database
    """
    # Connect to the database
    connection = get_db_connection()
    if not connection:
        print("Failed to connect to the database. Exiting.")
        return
    
    try:
        cursor = connection.cursor()
        
        # Path to the directory containing JSON files
        json_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'parsed_businesses')
        
        # Dictionary to keep track of unique categories
        categories = set()
        
        # Counter for imported businesses
        import_count = 0
        
        # Loop through each JSON file in the directory
        for filename in os.listdir(json_dir):
            if filename.endswith('.json'):
                file_path = os.path.join(json_dir, filename)
                
                # Skip empty files (4 bytes typically means an empty JSON array [])
                if os.path.getsize(file_path) <= 4:
                    print(f"Skipping empty file: {filename}")
                    continue
                
                print(f"Processing file: {filename}")
                
                try:
                    with open(file_path, 'r', encoding='utf-8') as file:
                        businesses = json.load(file)
                        
                        # Skip if the file is empty or not an array
                        if not businesses or not isinstance(businesses, list):
                            print(f"No valid data in file: {filename}")
                            continue
                        
                        # Insert each business into the database
                        for business in businesses:
                            # Extract business data
                            business_name = business.get('business_name', '')
                            location = business.get('location', '')
                            contact_name = business.get('contact_name', '')
                            tel = business.get('tel', '')
                            email = business.get('email', '')
                            description = business.get('description', '')
                            website = business.get('website', '')
                            category = business.get('category', '')
                            
                            # Skip if business name is empty
                            if not business_name:
                                continue
                            
                            # Add category to the set of unique categories
                            if category:
                                categories.add(category)
                            
                            # Check if the business already exists
                            check_query = "SELECT id FROM businesses WHERE business_name = %s AND tel = %s"
                            cursor.execute(check_query, (business_name, tel))
                            existing_business = cursor.fetchone()
                            
                            if existing_business:
                                print(f"Business already exists: {business_name}")
                                continue
                            
                            # Insert the business into the database
                            insert_query = """
                            INSERT INTO businesses 
                            (business_name, location, contact_name, tel, email, description, website, category)
                            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                            """
                            cursor.execute(insert_query, (
                                business_name, location, contact_name, tel, 
                                email, description, website, category
                            ))
                            import_count += 1
                            
                except json.JSONDecodeError as json_err:
                    print(f"Error decoding JSON in file {filename}: {json_err}")
                except Exception as e:
                    print(f"Error processing file {filename}: {e}")
        
        # Insert unique categories into the categories table
        for category in categories:
            try:
                cursor.execute("INSERT IGNORE INTO categories (name) VALUES (%s)", (category,))
            except Error as err:
                print(f"Error inserting category {category}: {err}")
        
        # Commit the changes
        connection.commit()
        print(f"Successfully imported {import_count} businesses into the database.")
        print(f"Added {len(categories)} unique categories.")
        
    except Error as err:
        print(f"Database error: {err}")
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()
            print("MySQL connection closed.")

if __name__ == "__main__":
    import_json_data()
