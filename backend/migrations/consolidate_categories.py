import mysql.connector
from mysql.connector import Error
import sys
import os

# Add the parent directory to the Python path so we can import db_config
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from db_config import get_db_connection

def consolidate_categories():
    """
    Consolidate the existing categories into meaningful, non-repeating categories
    and update all business records to use the new consolidated categories.
    """

    # Mapping from old categories to new consolidated categories
    category_mapping = {
        # Professional Services
        'accounting': 'Professional Services',
        'accounting & tax services': 'Professional Services',
        'business business consulting': 'Professional Services',
        'business resources': 'Professional Services',
        'business services': 'Professional Services',
        'busienss services/consulting': 'Professional Services',
        'business solutions': 'Professional Services',
        'consulting': 'Professional Services',
        'professional services': 'Professional Services',
        'human resources': 'Professional Services',
        'marketing': 'Professional Services',
        'managment': 'Professional Services',
        'promotion': 'Professional Services',
        'promotions': 'Professional Services',
        'organizational development': 'Professional Services',
        'advocacy': 'Professional Services',
        'conflict resolution services': 'Professional Services',
        'fingerprinting': 'Professional Services',
        'notary public': 'Professional Services',

        # Construction & Contractors
        'construction': 'Construction & Contractors',
        'construction contractors': 'Construction & Contractors',
        'construction management': 'Construction & Contractors',
        'construction services': 'Construction & Contractors',
        'contractor': 'Construction & Contractors',
        'contractors': 'Construction & Contractors',
        'general contractors': 'Construction & Contractors',
        'carpentry contractors': 'Construction & Contractors',
        'carpteting contractors': 'Construction & Contractors',
        'electrical': 'Construction & Contractors',
        'electricals': 'Construction & Contractors',
        'plumbing': 'Construction & Contractors',
        'plumbing & hvac contractors': 'Construction & Contractors',
        'roofing': 'Construction & Contractors',
        'painting': 'Construction & Contractors',
        'painting contractors': 'Construction & Contractors',
        'paving': 'Construction & Contractors',
        'paving contractors': 'Construction & Contractors',
        'asphalt paving': 'Construction & Contractors',
        'demolition': 'Construction & Contractors',
        'excavation': 'Construction & Contractors',
        'flooring': 'Construction & Contractors',
        'floor installation': 'Construction & Contractors',
        'metalwork contractors': 'Construction & Contractors',
        'fencing': 'Construction & Contractors',
        'fences': 'Construction & Contractors',
        'welding': 'Construction & Contractors',
        'water construction': 'Construction & Contractors',
        'air conditioning': 'Construction & Contractors',
        'elevator service': 'Construction & Contractors',
        'fire protection': 'Construction & Contractors',
        'installations': 'Construction & Contractors',
        'gate operators': 'Construction & Contractors',

        # Healthcare & Medical
        'pediatrics': 'Healthcare & Medical',
        'dental': 'Healthcare & Medical',
        'dentist': 'Healthcare & Medical',
        'dermatology': 'Healthcare & Medical',
        'gynecology': 'Healthcare & Medical',
        'health': 'Healthcare & Medical',
        'health services': 'Healthcare & Medical',
        'healthcare': 'Healthcare & Medical',
        'healthcare services': 'Healthcare & Medical',
        'medical': 'Healthcare & Medical',
        'physicians': 'Healthcare & Medical',
        'ophthalmology': 'Healthcare & Medical',
        'opticians': 'Healthcare & Medical',
        'podiatry': 'Healthcare & Medical',
        'pharmacy/clinic': 'Healthcare & Medical',
        'mental health & counseling services': 'Healthcare & Medical',
        'therapy': 'Healthcare & Medical',
        'rehabilitation': 'Healthcare & Medical',
        'counseling': 'Healthcare & Medical',
        'disability services': 'Healthcare & Medical',

        # Automotive Services
        'auto repair & services': 'Automotive Services',
        'automotive': 'Automotive Services',
        'mechanic': 'Automotive Services',
        'motorcycles': 'Automotive Services',

        # Transportation Services
        'transport': 'Transportation Services',
        'transport services': 'Transportation Services',
        'transportation': 'Transportation Services',
        'transportation services': 'Transportation Services',
        'bus services': 'Transportation Services',
        'courier': 'Transportation Services',
        'movers': 'Transportation Services',
        'heavy hauling': 'Transportation Services',
        'trucking': 'Transportation Services',
        'towing': 'Transportation Services',
        'travel': 'Transportation Services',

        # Home & Property Services
        'cleaning services': 'Home & Property Services',
        'janitorial services': 'Home & Property Services',
        'home improvement': 'Home & Property Services',
        'home remodelling': 'Home & Property Services',
        'home services': 'Home & Property Services',
        'appliance service': 'Home & Property Services',
        'carpet cleaning': 'Home & Property Services',
        'carpet sales': 'Home & Property Services',
        'carpet sales & installation': 'Home & Property Services',
        'draperies & windows': 'Home & Property Services',
        'property cleanout services': 'Home & Property Services',
        'pest control': 'Home & Property Services',
        'landscaping': 'Home & Property Services',
        'debris removal': 'Home & Property Services',
        'dumpster service': 'Home & Property Services',
        'waste management': 'Home & Property Services',
        'recycling': 'Home & Property Services',
        'window distribution': 'Home & Property Services',
        'properties': 'Home & Property Services',

        # Beauty & Personal Care
        'beauty academies & salons': 'Beauty & Personal Care',
        'salons': 'Beauty & Personal Care',
        'hair care': 'Beauty & Personal Care',
        'barber shops': 'Beauty & Personal Care',
        'esthetician': 'Beauty & Personal Care',
        'spas': 'Beauty & Personal Care',

        # Food & Dining
        'restaurant': 'Food & Dining',
        'restaurants': 'Food & Dining',
        'bakery': 'Food & Dining',
        'cafe': 'Food & Dining',
        'catering services': 'Food & Dining',
        'food service': 'Food & Dining',
        'beverages': 'Food & Dining',
        'desserts': 'Food & Dining',
        'gourmet products': 'Food & Dining',

        # Retail & Shopping
        'boutiques': 'Retail & Shopping',
        'retail & gift shops': 'Retail & Shopping',
        'retail & specialty shops': 'Retail & Shopping',
        'gift shops': 'Retail & Shopping',
        'clothing & apparrel': 'Retail & Shopping',
        'cltothing': 'Retail & Shopping',
        'furniture': 'Retail & Shopping',
        'home appliances': 'Retail & Shopping',
        'hardware': 'Retail & Shopping',
        'hats': 'Retail & Shopping',
        'bridal': 'Retail & Shopping',
        'equipments': 'Retail & Shopping',
        'camping equipment': 'Retail & Shopping',
        'facility supplies': 'Retail & Shopping',
        'awards': 'Retail & Shopping',
        'memorials': 'Retail & Shopping',

        # Technology Services
        'technology': 'Technology Services',
        'technology services': 'Technology Services',
        'computer sales & services': 'Technology Services',
        'computer services': 'Technology Services',
        'cybersecurity': 'Technology Services',
        'wireless services': 'Technology Services',
        'drones services': 'Technology Services',

        # Financial Services
        'finance': 'Financial Services',
        'mortgages': 'Financial Services',
        'banks': 'Financial Services',
        'money transfer/western union': 'Financial Services',
        'lottery': 'Financial Services',
        'insurance': 'Financial Services',
        'real estate': 'Financial Services',
        'real estate agencies': 'Financial Services',
        'realestate': 'Financial Services',

        # Education & Training
        'school': 'Education & Training',
        'college': 'Education & Training',
        'learning center': 'Education & Training',
        'driving schools': 'Education & Training',
        'training': 'Education & Training',
        'career & employment serviceds': 'Education & Training',
        'scholarships': 'Education & Training',
        'firearm training': 'Education & Training',
        'driving': 'Education & Training',

        # Entertainment & Events
        'entertainment': 'Entertainment & Events',
        'events': 'Entertainment & Events',
        'event venue': 'Entertainment & Events',
        'banquet halls event rentals': 'Entertainment & Events',
        'performing arts': 'Entertainment & Events',
        'bars & lounges': 'Entertainment & Events',
        'clubs': 'Entertainment & Events',
        'museums': 'Entertainment & Events',
        'fitness': 'Entertainment & Events',
        'health club': 'Entertainment & Events',
        'lift & health coaching': 'Entertainment & Events',

        # Community & Nonprofit
        'nonprofit & civic organizations': 'Community & Nonprofit',
        'nonprofit foundation': 'Community & Nonprofit',
        'nonprofit organization': 'Community & Nonprofit',
        'ngo': 'Community & Nonprofit',
        'charitable organizations': 'Community & Nonprofit',
        'charity': 'Community & Nonprofit',
        'community center': 'Community & Nonprofit',
        'community organizations': 'Community & Nonprofit',
        'youth organization': 'Community & Nonprofit',
        'association': 'Community & Nonprofit',
        'union': 'Community & Nonprofit',
        'civil rights organization': 'Community & Nonprofit',

        # Religious Organizations
        'church': 'Religious Organizations',
        'churches': 'Religious Organizations',

        # Media & Creative
        'media': 'Media & Creative',
        'media & production services': 'Media & Creative',
        'photography': 'Media & Creative',
        'radio station': 'Media & Creative',
        'radio stations': 'Media & Creative',
        'television': 'Media & Creative',
        'publishing services': 'Media & Creative',
        'magazines': 'Media & Creative',
        'art': 'Media & Creative',
        'art dealers': 'Media & Creative',
        'design': 'Media & Creative',
        'decorating': 'Media & Creative',
        'decorators': 'Media & Creative',
        'glass designers': 'Media & Creative',
        'embroidery': 'Media & Creative',
        'tailoring': 'Media & Creative',
        'signs': 'Media & Creative',
        'audiovisual': 'Media & Creative',

        # Childcare & Family Services
        'daycare': 'Childcare & Family Services',
        'daycare centers': 'Childcare & Family Services',
        'family services': 'Childcare & Family Services',
        'housing': 'Childcare & Family Services',
        'housing assistance': 'Childcare & Family Services',
        'assisted living': 'Childcare & Family Services',

        # Legal Services
        'law office': 'Legal Services',
        'legal': 'Legal Services',
        'legal services': 'Legal Services',
        'bail bond': 'Legal Services',
        'bail bonds': 'Legal Services',

        # Employment Services
        'employment agencies': 'Employment Services',
        'employment services': 'Employment Services',
        'staffing': 'Employment Services',

        # Security Services
        'security': 'Security Services',
        'firearms': 'Security Services',

        # Environmental Services
        'environmental': 'Environmental Services',
        'environmental engineeringconsulting': 'Environmental Services',
        'environmental services': 'Environmental Services',
        'environment': 'Environmental Services',

        # Engineering & Architecture
        'engineering': 'Engineering & Architecture',
        'architects': 'Engineering & Architecture',
        'planning': 'Engineering & Architecture',

        # Pet Services
        'pet services': 'Pet Services',

        # Funeral Services
        'funeral services': 'Funeral Services',

        # Specialty Services
        'florist': 'Specialty Services',
        'dry cleaners': 'Specialty Services',
        'lead inspection': 'Specialty Services',
        'vendor': 'Specialty Services',

        # Government
        'government': 'Government'
    }

    connection = get_db_connection()
    if not connection:
        print("Failed to connect to database")
        return False

    try:
        cursor = connection.cursor()

        print("Starting category consolidation process...")

        # Step 1: Get all unique new categories from the mapping
        new_categories = set(category_mapping.values())

        # Step 2: Clear existing categories table and insert new consolidated categories
        print("Clearing existing categories and inserting new consolidated categories...")
        cursor.execute("DELETE FROM categories")

        for new_category in sorted(new_categories):
            cursor.execute("INSERT INTO categories (name) VALUES (%s)", (new_category,))

        # Step 3: Update businesses table with new categories
        print("Updating business categories...")

        updated_count = 0
        unmapped_categories = set()

        # Get all current business categories
        cursor.execute("SELECT DISTINCT category FROM businesses WHERE category IS NOT NULL AND category != ''")
        existing_categories = cursor.fetchall()

        for (category,) in existing_categories:
            category_lower = category.lower().strip()

            if category_lower in category_mapping:
                new_category = category_mapping[category_lower]
                cursor.execute(
                    "UPDATE businesses SET category = %s WHERE LOWER(TRIM(category)) = %s",
                    (new_category, category_lower)
                )
                updated_count += cursor.rowcount
                print(f"Updated '{category}' -> '{new_category}' ({cursor.rowcount} businesses)")
            else:
                unmapped_categories.add(category)

        # Step 4: Handle unmapped categories
        if unmapped_categories:
            print(f"\nFound {len(unmapped_categories)} unmapped categories:")
            for cat in sorted(unmapped_categories):
                print(f"  - {cat}")
            print("\nThese categories will remain unchanged. You may want to manually review and update them.")

        # Commit all changes
        connection.commit()

        # Step 5: Show summary
        cursor.execute("SELECT COUNT(*) FROM categories")
        total_categories = cursor.fetchone()[0]

        cursor.execute("SELECT COUNT(*) FROM businesses WHERE category IS NOT NULL AND category != ''")
        total_businesses_with_categories = cursor.fetchone()[0]

        print(f"\n=== CONSOLIDATION COMPLETE ===")
        print(f"Total new categories: {total_categories}")
        print(f"Businesses updated: {updated_count}")
        print(f"Total businesses with categories: {total_businesses_with_categories}")
        print(f"Unmapped categories: {len(unmapped_categories)}")

        # Show category distribution
        print(f"\n=== CATEGORY DISTRIBUTION ===")
        cursor.execute("""
            SELECT category, COUNT(*) as business_count
            FROM businesses
            WHERE category IS NOT NULL AND category != ''
            GROUP BY category
            ORDER BY business_count DESC
        """)

        category_stats = cursor.fetchall()
        for category, count in category_stats:
            print(f"{category}: {count} businesses")

        return True

    except Error as err:
        print(f"Database error: {err}")
        connection.rollback()
        return False

    finally:
        if connection and connection.is_connected():
            cursor.close()
            connection.close()

def rollback_consolidation():
    """
    WARNING: This will only work if you have a backup of your original data.
    This function is provided for reference but cannot restore the original categories
    without a backup.
    """
    print("WARNING: Rollback requires a database backup with original categories.")
    print("Please restore from your backup if you need to undo the consolidation.")
    return False

if __name__ == "__main__":
    print("Category Consolidation Script")
    print("============================")

    if len(sys.argv) > 1 and sys.argv[1] == "--rollback":
        rollback_consolidation()
    elif len(sys.argv) > 1 and sys.argv[1] == "--auto-confirm":
        print("Running in auto-confirm mode...")
        success = consolidate_categories()
        if success:
            print("\nConsolidation completed successfully!")
            print("Your category dropdown will now show the new consolidated categories.")
        else:
            print("\nConsolidation failed. Please check the error messages above.")
    else:
        print("This script will:")
        print("1. Replace all existing categories with consolidated ones")
        print("2. Update all business records to use new category names")
        print("3. Show unmapped categories for manual review")
        print()

        response = input("Are you sure you want to proceed? (yes/no): ")

        if response.lower() in ['yes', 'y']:
            success = consolidate_categories()
            if success:
                print("\nConsolidation completed successfully!")
                print("Your category dropdown will now show the new consolidated categories.")
            else:
                print("\nConsolidation failed. Please check the error messages above.")
        else:
            print("Consolidation cancelled.")
