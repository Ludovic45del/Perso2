import sqlite3
import os
import django

# Configuration Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.db import connection

conn = sqlite3.connect('db.sqlite3')
cursor = conn.cursor()

# Disable foreign keys temporarily
cursor.execute('PRAGMA foreign_keys = OFF')

try:
    # List all existing tables
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name")
    existing_tables = [row[0] for row in cursor.fetchall()]
    print(f"Existing tables: {existing_tables}\n")

    # 1. Create FSEC_STATUS table if needed
    print("=== Creating FSEC_STATUS ===")
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS "FSEC_STATUS" (
            "id" INTEGER NOT NULL PRIMARY KEY,
            "label" varchar(40) NOT NULL,
            "color" varchar(40) NOT NULL
        )
    ''')
    print("✓ FSEC_STATUS table created/verified")

    # 2. Create FSEC_CATEGORY table if needed
    print("\n=== Creating FSEC_CATEGORY ===")
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS "FSEC_CATEGORY" (
            "id" INTEGER NOT NULL PRIMARY KEY,
            "label" varchar(40) NOT NULL,
            "color" varchar(40) NOT NULL
        )
    ''')
    print("✓ FSEC_CATEGORY table created/verified")

    # 3. Create FSEC_RACK table if needed
    print("\n=== Creating FSEC_RACK ===")
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS "FSEC_RACK" (
            "id" INTEGER NOT NULL PRIMARY KEY,
            "label" varchar(40) NOT NULL,
            "color" varchar(40) NOT NULL,
            "is_full" bool NOT NULL
        )
    ''')
    print("✓ FSEC_RACK table created/verified")

    # 4. Check if FSEC table exists and if it has correct structure
    print("\n=== Checking FSEC table ===")
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='FSEC'")
    fsec_exists = cursor.fetchone()

    if fsec_exists:
        # Check current structure
        cursor.execute("PRAGMA table_info(FSEC)")
        columns = cursor.fetchall()
        print(f"Current FSEC columns: {[(col[1], col[2]) for col in columns]}")

        # Drop and recreate FSEC table with correct foreign keys
        print("Dropping existing FSEC table...")
        cursor.execute('DROP TABLE IF EXISTS FSEC')

    # Create FSEC table with proper structure
    print("Creating FSEC table with correct foreign keys...")
    cursor.execute('''
        CREATE TABLE "FSEC" (
            "version_uuid" char(32) NOT NULL PRIMARY KEY,
            "fsec_uuid" char(32) NOT NULL,
            "last_updated" datetime NOT NULL,
            "is_active" bool NOT NULL,
            "created_at" datetime NOT NULL,
            "name" varchar(50) NOT NULL,
            "comments" text NULL,
            "delivery_date" date NULL,
            "shooting_date" date NULL,
            "preshooting_pressure" real NULL,
            "experience_srxx" varchar(50) NULL,
            "localisation" varchar(20) NULL,
            "depressurization_failed" bool NULL,
            "campaign_id" char(32) NULL,
            "category_id" integer NOT NULL,
            "rack_id" integer NULL,
            "status_id" integer NOT NULL,
            FOREIGN KEY ("campaign_id") REFERENCES "CAMPAIGN" ("uuid") DEFERRABLE INITIALLY DEFERRED,
            FOREIGN KEY ("category_id") REFERENCES "FSEC_CATEGORY" ("id") DEFERRABLE INITIALLY DEFERRED,
            FOREIGN KEY ("rack_id") REFERENCES "FSEC_RACK" ("id") DEFERRABLE INITIALLY DEFERRED,
            FOREIGN KEY ("status_id") REFERENCES "FSEC_STATUS" ("id") DEFERRABLE INITIALLY DEFERRED
        )
    ''')

    # Create indexes
    cursor.execute('CREATE INDEX IF NOT EXISTS "FSEC_campaign_id_a66994e9" ON "FSEC" ("campaign_id")')
    cursor.execute('CREATE INDEX IF NOT EXISTS "FSEC_category_id_0c623b1a" ON "FSEC" ("category_id")')
    cursor.execute('CREATE INDEX IF NOT EXISTS "FSEC_rack_id_2ee670f2" ON "FSEC" ("rack_id")')
    cursor.execute('CREATE INDEX IF NOT EXISTS "FSEC_status_id_d34a2938" ON "FSEC" ("status_id")')
    cursor.execute('CREATE UNIQUE INDEX IF NOT EXISTS "FSEC_campaign_id_name_7ccc71a0_uniq" ON "FSEC" ("campaign_id", "name")')

    print("✓ FSEC table created with correct foreign keys")

    # Commit changes
    conn.commit()
    print("\n✓ All FSEC tables created successfully!")

except Exception as e:
    print(f"✗ Error: {e}")
    conn.rollback()
finally:
    # Re-enable foreign keys
    cursor.execute('PRAGMA foreign_keys = ON')
    conn.close()
