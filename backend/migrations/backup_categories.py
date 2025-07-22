import mysql.connector
from mysql.connector import Error
import json
import sys
import os
from datetime import datetime

# Add the parent directory to the Python path so we can import db_config
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from db_config import get_db_connection

def backup_categories():
    """
    Create a backup of current categories and business category mappings
    before running the consolidation script.
    """

    connection = get_db_connection()
    if not connection:
        print("Failed to connect to database")
        return False

    try:
        cursor = connection.cursor(dictionary=True)

        # Create timestamp for backup file
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        backup_filename = f"category_backup_{timestamp}.json"
        backup_path = os.path.join(os.path.dirname(__file__), backup_filename)

        backup_data = {
            "backup_timestamp": timestamp,
            "categories": [],
            "businesses": []
        }

        print("Creating category backup...")

        # Backup categories table
        cursor.execute("SELECT * FROM categories ORDER BY id")
        categories = cursor.fetchall()
        backup_data["categories"] = categories
        print(f"Backed up {len(categories)} categories")

        # Backup businesses with their current categories
        cursor.execute("""
            SELECT id, business_name, category
            FROM businesses
            WHERE category IS NOT NULL AND category != ''
            ORDER BY id
        """)
        businesses = cursor.fetchall()
        backup_data["businesses"] = businesses
        print(f"Backed up {len(businesses)} businesses with categories")

        # Write backup to JSON file
        with open(backup_path, 'w', encoding='utf-8') as f:
            json.dump(backup_data, f, indent=2, ensure_ascii=False, default=str)

        print(f"Backup saved to: {backup_path}")

        # Show current category statistics
        print(f"\n=== CURRENT CATEGORY STATISTICS ===")
        cursor.execute("""
            SELECT category, COUNT(*) as business_count
            FROM businesses
            WHERE category IS NOT NULL AND category != ''
            GROUP BY category
            ORDER BY business_count DESC
            LIMIT 20
        """)

        top_categories = cursor.fetchall()
        print("Top 20 categories by business count:")
        for cat_data in top_categories:
            print(f"  {cat_data['category']}: {cat_data['business_count']} businesses")

        # Show total unique categories
        cursor.execute("""
            SELECT COUNT(DISTINCT category) as unique_categories
            FROM businesses
            WHERE category IS NOT NULL AND category != ''
        """)
        unique_count = cursor.fetchone()['unique_categories']
        print(f"\nTotal unique categories in businesses: {unique_count}")

        cursor.execute("SELECT COUNT(*) as category_count FROM categories")
        category_table_count = cursor.fetchone()['category_count']
        print(f"Total categories in categories table: {category_table_count}")

        return backup_path

    except Error as err:
        print(f"Database error: {err}")
        return False

    except Exception as e:
        print(f"Unexpected error: {e}")
        return False

    finally:
        if connection and connection.is_connected():
            cursor.close()
            connection.close()

def restore_from_backup(backup_file):
    """
    Restore categories from a backup file.
    """

    if not os.path.exists(backup_file):
        print(f"Backup file not found: {backup_file}")
        return False

    connection = get_db_connection()
    if not connection:
        print("Failed to connect to database")
        return False

    try:
        cursor = connection.cursor()

        # Load backup data
        with open(backup_file, 'r', encoding='utf-8') as f:
            backup_data = json.load(f)

        print(f"Restoring from backup created at: {backup_data['backup_timestamp']}")

        # Clear current categories
        cursor.execute("DELETE FROM categories")

        # Restore categories
        categories = backup_data.get('categories', [])
        for category in categories:
            cursor.execute(
                "INSERT INTO categories (id, name) VALUES (%s, %s)",
                (category['id'], category['name'])
            )

        print(f"Restored {len(categories)} categories")

        # Restore business categories
        businesses = backup_data.get('businesses', [])
        restored_count = 0

        for business in businesses:
            cursor.execute(
                "UPDATE businesses SET category = %s WHERE id = %s",
                (business['category'], business['id'])
            )
            if cursor.rowcount > 0:
                restored_count += 1

        print(f"Restored categories for {restored_count} businesses")

        # Commit changes
        connection.commit()

        print("Restoration completed successfully!")
        return True

    except Error as err:
        print(f"Database error during restoration: {err}")
        connection.rollback()
        return False

    except Exception as e:
        print(f"Unexpected error during restoration: {e}")
        return False

    finally:
        if connection and connection.is_connected():
            cursor.close()
            connection.close()

def list_backups():
    """
    List available backup files in the migrations directory.
    """

    migrations_dir = os.path.dirname(__file__)
    backup_files = []

    for filename in os.listdir(migrations_dir):
        if filename.startswith('category_backup_') and filename.endswith('.json'):
            file_path = os.path.join(migrations_dir, filename)
            file_stat = os.stat(file_path)
            backup_files.append({
                'filename': filename,
                'path': file_path,
                'size': file_stat.st_size,
                'modified': datetime.fromtimestamp(file_stat.st_mtime)
            })

    if not backup_files:
        print("No backup files found.")
        return []

    backup_files.sort(key=lambda x: x['modified'], reverse=True)

    print("Available backup files:")
    for i, backup in enumerate(backup_files, 1):
        print(f"{i}. {backup['filename']}")
        print(f"   Created: {backup['modified'].strftime('%Y-%m-%d %H:%M:%S')}")
        print(f"   Size: {backup['size']:,} bytes")
        print()

    return backup_files

if __name__ == "__main__":
    print("Category Backup Script")
    print("======================")

    if len(sys.argv) > 1:
        command = sys.argv[1]

        if command == "--restore":
            if len(sys.argv) > 2:
                backup_file = sys.argv[2]
                restore_from_backup(backup_file)
            else:
                print("Usage: python backup_categories.py --restore <backup_file>")
                list_backups()

        elif command == "--list":
            list_backups()

        else:
            print("Unknown command. Available commands:")
            print("  --list     : List available backup files")
            print("  --restore  : Restore from backup file")

    else:
        # Default action: create backup
        print("Creating backup of current categories...")
        print("This is recommended before running the consolidation script.")
        print()

        backup_path = backup_categories()

        if backup_path:
            print(f"\nBackup created successfully!")
            print(f"File: {backup_path}")
            print("\nYou can now safely run the consolidation script:")
            print("python consolidate_categories.py")
            print("\nIf you need to restore, use:")
            print(f"python backup_categories.py --restore {os.path.basename(backup_path)}")
        else:
            print("Backup failed. Please check the error messages above.")
