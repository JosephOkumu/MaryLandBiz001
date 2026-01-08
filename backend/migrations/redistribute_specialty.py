import mysql.connector
import sys
import os

# Add parent directory to path to import db_config
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from db_config import get_db_connection

def redistribute():
    conn = get_db_connection()
    if not conn:
        print("Failed to connect")
        return

    cursor = conn.cursor()

    # 1. Move Florists and Vending to Retail & Shopping
    retail_ids = [301, 302, 303, 404]
    if retail_ids:
        format_strings = ','.join(['%s'] * len(retail_ids))
        cursor.execute(f"UPDATE businesses SET category = 'Retail & Shopping' WHERE id IN ({format_strings})", tuple(retail_ids))
        print(f"Moved {cursor.rowcount} businesses to Retail & Shopping")

    # 2. Move Lead Inspection, Dry Cleaners, and Travis Shaw to Home & Property Services
    home_ids = [88, 319, 325, 326]
    if home_ids:
        format_strings = ','.join(['%s'] * len(home_ids))
        cursor.execute(f"UPDATE businesses SET category = 'Home & Property Services' WHERE id IN ({format_strings})", tuple(home_ids))
        print(f"Moved {cursor.rowcount} businesses to Home & Property Services")

    # 3. Delete the category from categories table if it exists
    cursor.execute("DELETE FROM categories WHERE name = 'Specialty Services'")
    print("Deleted 'Specialty Services' from categories table")

    conn.commit()
    cursor.close()
    conn.close()

if __name__ == "__main__":
    redistribute()
