import random
from db_config import get_db_connection

def set_featured_businesses(count=6):
    """
    Randomly selects a specified number of businesses and marks them as featured
    """
    connection = get_db_connection()
    if not connection:
        print("Failed to connect to the database. Exiting.")
        return
    
    try:
        cursor = connection.cursor()
        
        # First, clear any existing featured businesses
        clear_query = "UPDATE businesses SET featured = FALSE"
        cursor.execute(clear_query)
        print("Cleared existing featured businesses")
        
        # Get a list of all business IDs
        cursor.execute("SELECT id FROM businesses")
        all_business_ids = [row[0] for row in cursor.fetchall()]
        
        if not all_business_ids:
            print("No businesses found in the database")
            return
        
        # Select random business IDs to feature
        num_to_feature = min(count, len(all_business_ids))
        featured_ids = random.sample(all_business_ids, num_to_feature)
        
        # Update selected businesses to be featured
        for business_id in featured_ids:
            update_query = "UPDATE businesses SET featured = TRUE WHERE id = %s"
            cursor.execute(update_query, (business_id,))
        
        connection.commit()
        print(f"Successfully marked {num_to_feature} businesses as featured")
        
    except Exception as e:
        print(f"Error setting featured businesses: {e}")
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()
            print("MySQL connection closed")

if __name__ == "__main__":
    set_featured_businesses()
