import mysql.connector
from db_config import get_db_connection

def list_specialty_services():
    conn = get_db_connection()
    if not conn:
        print("Failed to connect to database")
        return

    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT id, business_name, description, category FROM businesses WHERE category = 'Specialty Services'")
    businesses = cursor.fetchall()
    
    print(f"Found {len(businesses)} businesses in 'Specialty Services':")
    for b in businesses:
        print(f"- {b['business_name']} (ID: {b['id']})")

    cursor.close()
    conn.close()

if __name__ == "__main__":
    list_specialty_services()
