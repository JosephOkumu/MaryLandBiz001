import mysql.connector
import sys
import os

# Add parent directory to path to import db_config
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from db_config import get_db_connection

def rename_category():
    conn = get_db_connection()
    if not conn:
        print("Failed to connect")
        return

    cursor = conn.cursor()

    # 1. Update businesses
    cursor.execute("UPDATE businesses SET category = 'Business Support Services' WHERE category = 'Professional Services'")
    print(f"Updated {cursor.rowcount} businesses")

    # 2. Update categories table
    cursor.execute("UPDATE categories SET name = 'Business Support Services' WHERE name = 'Professional Services'")
    print(f"Updated {cursor.rowcount} category record")

    conn.commit()
    cursor.close()
    conn.close()

if __name__ == "__main__":
    rename_category()
