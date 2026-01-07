#!/usr/bin/env python3
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from db_config import get_db_connection

def check_images():
    conn = get_db_connection()
    if not conn:
        print("❌ Failed to connect to database")
        return
    
    try:
        cursor = conn.cursor(dictionary=True)
        
        print("\n=== BUSINESSES WITH IMAGES ===")
        cursor.execute("SELECT id, business_name, image_url FROM businesses WHERE image_url IS NOT NULL AND image_url != '' LIMIT 10")
        businesses = cursor.fetchall()
        if businesses:
            for b in businesses:
                print(f"ID: {b['id']}, Name: {b['business_name']}, Image: {b['image_url']}")
        else:
            print("No businesses with images found")
        
        print("\n=== BUSINESS APPLICATIONS WITH IMAGES ===")
        cursor.execute("SELECT id, business_name, image_url, status FROM business_applications WHERE image_url IS NOT NULL AND image_url != '' LIMIT 10")
        apps = cursor.fetchall()
        if apps:
            for a in apps:
                print(f"ID: {a['id']}, Name: {a['business_name']}, Image: {a['image_url']}, Status: {a['status']}")
        else:
            print("No applications with images found")
        
        print("\n=== CHECKING UPLOAD DIRECTORY ===")
        upload_dir = os.path.join(os.path.dirname(__file__), 'uploads', 'business_images')
        if os.path.exists(upload_dir):
            files = os.listdir(upload_dir)
            if files:
                print(f"Found {len(files)} files:")
                for f in files[:10]:
                    print(f"  - {f}")
            else:
                print("Upload directory is empty")
        else:
            print("Upload directory does not exist!")
        
        cursor.close()
        conn.close()
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    check_images()
