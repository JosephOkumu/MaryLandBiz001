#!/usr/bin/env python3
"""
Category Migration Runner Script
===============================

This script helps you safely migrate your categories from the long list of
duplicated/similar categories to a clean, consolidated set of categories.

Usage:
    python run_category_migration.py

This will:
1. Create a backup of your current categories
2. Run the consolidation migration
3. Show before/after statistics
"""

import os
import sys
import subprocess
from datetime import datetime

def run_command(command, description):
    """Run a system command and handle errors."""
    print(f"\n{'='*50}")
    print(f"STEP: {description}")
    print(f"{'='*50}")

    try:
        # Change to the migrations directory
        migrations_dir = os.path.join(os.path.dirname(__file__), 'migrations')

        result = subprocess.run(
            command,
            cwd=migrations_dir,
            shell=True,
            capture_output=True,
            text=True
        )

        if result.stdout:
            print(result.stdout)

        if result.stderr:
            print("STDERR:", result.stderr)

        if result.returncode != 0:
            print(f"Command failed with return code: {result.returncode}")
            return False

        return True

    except Exception as e:
        print(f"Error running command: {e}")
        return False

def main():
    print("Maryland Business Directory - Category Migration")
    print("=" * 55)
    print()
    print("This script will consolidate your business categories from:")
    print("  - Current: ~100+ categories with duplicates and variations")
    print("  - New: 25 clean, organized category groups")
    print()
    print("The process includes:")
    print("  1. Backup current data (safety first!)")
    print("  2. Consolidate categories using intelligent mapping")
    print("  3. Update all business records")
    print("  4. Show before/after statistics")
    print()

    # Check if migrations directory exists
    migrations_dir = os.path.join(os.path.dirname(__file__), 'migrations')
    if not os.path.exists(migrations_dir):
        print("ERROR: Migrations directory not found!")
        print(f"Expected: {migrations_dir}")
        return False

    # Check if required scripts exist
    backup_script = os.path.join(migrations_dir, 'backup_categories.py')
    consolidate_script = os.path.join(migrations_dir, 'consolidate_categories.py')

    if not os.path.exists(backup_script):
        print(f"ERROR: Backup script not found: {backup_script}")
        return False

    if not os.path.exists(consolidate_script):
        print(f"ERROR: Consolidation script not found: {consolidate_script}")
        return False

    # Get user confirmation
    response = input("Do you want to proceed with the category migration? (yes/no): ")
    if response.lower() not in ['yes', 'y']:
        print("Migration cancelled.")
        return False

    print(f"\nStarting migration at {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

    # Step 1: Create backup
    success = run_command(
        "python backup_categories.py",
        "Creating backup of current categories"
    )

    if not success:
        print("\nERROR: Backup failed. Migration aborted for safety.")
        return False

    # Step 2: Run consolidation
    success = run_command(
        "python consolidate_categories.py --auto-confirm",
        "Running category consolidation"
    )

    if not success:
        print("\nERROR: Consolidation failed.")
        print("Your data is safe - the backup was created successfully.")
        print("To restore original categories if needed:")
        print("  cd migrations")
        print("  python backup_categories.py --list")
        print("  python backup_categories.py --restore <backup_file>")
        return False

    print(f"\n{'='*60}")
    print("MIGRATION COMPLETED SUCCESSFULLY!")
    print(f"{'='*60}")
    print()
    print("What changed:")
    print("  ✅ All duplicate categories merged into organized groups")
    print("  ✅ Business records updated with new category names")
    print("  ✅ Category dropdown now shows clean, meaningful options")
    print("  ✅ Original data backed up for safety")
    print()
    print("Next steps:")
    print("  1. Test your frontend category dropdown")
    print("  2. Verify businesses appear in correct categories")
    print("  3. Review any unmapped categories (if shown above)")
    print()
    print("If you need to revert:")
    print("  cd migrations")
    print("  python backup_categories.py --list")
    print("  python backup_categories.py --restore <backup_file>")

    return True

def show_help():
    print("Maryland Business Directory - Category Migration Tool")
    print()
    print("Commands:")
    print("  python run_category_migration.py          - Run full migration")
    print("  python run_category_migration.py --help   - Show this help")
    print("  python run_category_migration.py --backup - Create backup only")
    print("  python run_category_migration.py --list   - List available backups")
    print()

if __name__ == "__main__":
    if len(sys.argv) > 1:
        command = sys.argv[1]

        if command == "--help":
            show_help()
        elif command == "--backup":
            success = run_command(
                "python backup_categories.py",
                "Creating backup of current categories"
            )
            print("Backup completed!" if success else "Backup failed!")
        elif command == "--list":
            run_command(
                "python backup_categories.py --list",
                "Listing available backups"
            )
        else:
            print(f"Unknown command: {command}")
            show_help()
    else:
        main()
