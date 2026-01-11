import sqlite3
import os
import django

# Configuration Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.db import connection

# SQL pour créer toutes les tables manquantes
SQL_STATEMENTS = [
    # CAMPAIGN_TEAMS
    '''CREATE TABLE IF NOT EXISTS "CAMPAIGN_TEAMS" (
        "uuid" char(32) NOT NULL PRIMARY KEY,
        "name" varchar(50) NULL,
        "campaign_uuid_id" char(32) NOT NULL,
        "role_id" integer NULL,
        FOREIGN KEY ("campaign_uuid_id") REFERENCES "CAMPAIGN" ("uuid") DEFERRABLE INITIALLY DEFERRED,
        FOREIGN KEY ("role_id") REFERENCES "CAMPAIGN_ROLES" ("id") DEFERRABLE INITIALLY DEFERRED
    )''',
    '''CREATE INDEX IF NOT EXISTS "CAMPAIGN_TEAMS_campaign_uuid_id_2d4f99cd" ON "CAMPAIGN_TEAMS" ("campaign_uuid_id")''',
    '''CREATE INDEX IF NOT EXISTS "CAMPAIGN_TEAMS_role_id_7df1e228" ON "CAMPAIGN_TEAMS" ("role_id")''',

    # CAMPAIGN_DOCUMENTS
    '''CREATE TABLE IF NOT EXISTS "CAMPAIGN_DOCUMENTS" (
        "uuid" char(32) NOT NULL PRIMARY KEY,
        "name" varchar(50) NULL,
        "path" varchar(256) NULL,
        "date" datetime NULL,
        "campaign_uuid_id" char(32) NOT NULL,
        "subtype_id" integer NOT NULL,
        FOREIGN KEY ("campaign_uuid_id") REFERENCES "CAMPAIGN" ("uuid") DEFERRABLE INITIALLY DEFERRED,
        FOREIGN KEY ("subtype_id") REFERENCES "CAMPAIGN_DOCUMENT_SUBTYPES" ("id") DEFERRABLE INITIALLY DEFERRED
    )''',
    '''CREATE INDEX IF NOT EXISTS "CAMPAIGN_DOCUMENTS_campaign_uuid_id_b6811c3f" ON "CAMPAIGN_DOCUMENTS" ("campaign_uuid_id")''',
    '''CREATE INDEX IF NOT EXISTS "CAMPAIGN_DOCUMENTS_subtype_id_02157efa" ON "CAMPAIGN_DOCUMENTS" ("subtype_id")''',

    # FSEC
    '''CREATE TABLE IF NOT EXISTS "FSEC" (
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
    )''',
    '''CREATE INDEX IF NOT EXISTS "FSEC_campaign_id_a66994e9" ON "FSEC" ("campaign_id")''',
    '''CREATE INDEX IF NOT EXISTS "FSEC_category_id_0c623b1a" ON "FSEC" ("category_id")''',
    '''CREATE INDEX IF NOT EXISTS "FSEC_rack_id_2ee670f2" ON "FSEC" ("rack_id")''',
    '''CREATE INDEX IF NOT EXISTS "FSEC_status_id_d34a2938" ON "FSEC" ("status_id")''',
    '''CREATE UNIQUE INDEX IF NOT EXISTS "FSEC_campaign_id_name_7ccc71a0_uniq" ON "FSEC" ("campaign_id", "name")''',

    # Tables de stock
    '''CREATE TABLE IF NOT EXISTS "STOCKS_CONSUMABLES_GLUES" (
        "uuid" char(32) NOT NULL PRIMARY KEY,
        "item" varchar(100) NULL,
        "stocks" varchar(100) NULL,
        "unit" varchar(100) NULL,
        "reference" varchar(100) NULL,
        "buying_type" varchar(100) NULL,
        "supplier" varchar(100) NULL,
        "expiry_date" date NULL,
        "additional_comment" varchar(400) NULL
    )''',

    '''CREATE TABLE IF NOT EXISTS "STOCKS_CONSUMABLES_OTHER" (
        "uuid" char(32) NOT NULL PRIMARY KEY,
        "item" varchar(100) NULL,
        "stocks" varchar(100) NULL,
        "unit" varchar(100) NULL,
        "reference" varchar(100) NULL,
        "buying_type" varchar(100) NULL,
        "supplier" varchar(100) NULL,
        "expiry_date" date NULL,
        "additional_comment" varchar(400) NULL
    )''',

    '''CREATE TABLE IF NOT EXISTS "STOCKS_INVENTORY_BASIC_PARTS" (
        "uuid" char(32) NOT NULL PRIMARY KEY,
        "element_name" varchar(100) NULL,
        "availability" varchar(100) NULL,
        "box_number_or_box_description" varchar(100) NULL,
        "delivery_date" date NULL,
        "exit_date" date NULL,
        "used_campaign" varchar(100) NULL,
        "additional_comment" varchar(400) NULL,
        "fsec" varchar(100) NULL
    )''',

    '''CREATE TABLE IF NOT EXISTS "STOCKS_INVENTORY_EC_STRUCTURING" (
        "uuid" char(32) NOT NULL PRIMARY KEY,
        "item" varchar(100) NULL,
        "stocks" varchar(100) NULL,
        "unit" varchar(100) NULL,
        "reference" varchar(100) NULL,
        "buying_type" varchar(100) NULL,
        "supplier" varchar(100) NULL,
        "additional_comment" varchar(400) NULL,
        "fsec" varchar(100) NULL
    )''',

    '''CREATE TABLE IF NOT EXISTS "STOCKS_INVENTORY_LMJ" (
        "uuid" char(32) NOT NULL PRIMARY KEY,
        "iec" varchar(100) NULL,
        "elements_or_target_description" varchar(100) NULL,
        "digits_if_untagged_element" varchar(100) NULL,
        "targets_or_element_number" varchar(100) NULL,
        "box_number_or_box_description" varchar(100) NULL,
        "localisation" varchar(100) NULL,
        "delivery_date" date NULL,
        "exit_date" date NULL,
        "campaign_dtri_number" varchar(100) NULL,
        "additional_comment" varchar(400) NULL,
        "fsec" varchar(100) NULL
    )''',

    '''CREATE TABLE IF NOT EXISTS "STOCKS_INVENTORY_OMEGA" (
        "uuid" char(32) NOT NULL PRIMARY KEY,
        "iec" varchar(100) NULL,
        "elements_or_target_description" varchar(100) NULL,
        "digits_if_untagged_element" varchar(100) NULL,
        "targets_or_element_number" varchar(100) NULL,
        "box_number_or_box_description" varchar(100) NULL,
        "localisation" varchar(100) NULL,
        "delivery_date" date NULL,
        "exit_date" date NULL,
        "drmn_campaign_number" varchar(100) NULL,
        "additional_comment" varchar(400) NULL,
        "fsec" varchar(100) NULL
    )''',

    '''CREATE TABLE IF NOT EXISTS "STOCKS_STRUCTURING" (
        "uuid" char(32) NOT NULL PRIMARY KEY,
        "item" varchar(100) NULL,
        "stocks" varchar(100) NULL,
        "unit" varchar(100) NULL,
        "reference" varchar(100) NULL,
        "buying_type" varchar(100) NULL,
        "supplier" varchar(100) NULL,
        "additional_comment" varchar(400) NULL
    )''',

    '''CREATE TABLE IF NOT EXISTS "STOCKS_SPECIAL_STRUCTURING" (
        "uuid" char(32) NOT NULL PRIMARY KEY,
        "item" varchar(100) NULL,
        "stocks" varchar(100) NULL,
        "unit" varchar(100) NULL,
        "reference" varchar(100) NULL,
        "buying_type" varchar(100) NULL,
        "supplier" varchar(100) NULL,
        "additional_comment" varchar(400) NULL
    )''',

    '''CREATE TABLE IF NOT EXISTS "STOCKS_TRANSFERS" (
        "uuid" char(32) NOT NULL PRIMARY KEY,
        "date" date NULL,
        "issuer" varchar(100) NULL,
        "recipient" varchar(100) NULL,
        "additional_comment" varchar(400) NULL
    )''',

    # Steps FSEC
    '''CREATE TABLE IF NOT EXISTS "PERMEATION_STEP" (
        "uuid" char(32) NOT NULL PRIMARY KEY,
        "permeation_validated" bool NULL,
        "date_of_fulfilment" date NULL,
        "observations" text NULL,
        "fsec_version_id" char(32) NOT NULL,
        FOREIGN KEY ("fsec_version_id") REFERENCES "FSEC" ("version_uuid") DEFERRABLE INITIALLY DEFERRED
    )''',
    '''CREATE INDEX IF NOT EXISTS "PERMEATION_STEP_fsec_version_id_cf12050a" ON "PERMEATION_STEP" ("fsec_version_id")''',

    '''CREATE TABLE IF NOT EXISTS "GAS_FILLING_BP_STEP" (
        "uuid" char(32) NOT NULL PRIMARY KEY,
        "operator" text NULL,
        "date_of_fulfilment" date NULL,
        "pressure_gauge" real NULL,
        "enclosure_pressure_measured" real NULL,
        "observations" text NULL,
        "fsec_version_id" char(32) NOT NULL,
        FOREIGN KEY ("fsec_version_id") REFERENCES "FSEC" ("version_uuid") DEFERRABLE INITIALLY DEFERRED
    )''',
    '''CREATE INDEX IF NOT EXISTS "GAS_FILLING_BP_STEP_fsec_version_id_200cf279" ON "GAS_FILLING_BP_STEP" ("fsec_version_id")''',

    '''CREATE TABLE IF NOT EXISTS "GAS_FILLING_HP_STEP" (
        "uuid" char(32) NOT NULL PRIMARY KEY,
        "operator" text NULL,
        "date_of_fulfilment" date NULL,
        "pressure_gauge" real NULL,
        "enclosure_pressure_measured" real NULL,
        "observations" text NULL,
        "fsec_version_id" char(32) NOT NULL,
        FOREIGN KEY ("fsec_version_id") REFERENCES "FSEC" ("version_uuid") DEFERRABLE INITIALLY DEFERRED
    )''',
    '''CREATE INDEX IF NOT EXISTS "GAS_FILLING_HP_STEP_fsec_version_id_69527fde" ON "GAS_FILLING_HP_STEP" ("fsec_version_id")''',

    '''CREATE TABLE IF NOT EXISTS "DEPRESSURIZATION_STEP" (
        "uuid" char(32) NOT NULL PRIMARY KEY,
        "operator" text NULL,
        "date_of_fulfilment" date NULL,
        "pressure_gauge" real NULL,
        "enclosure_pressure_measured" real NULL,
        "start_time" datetime NULL,
        "end_time" datetime NULL,
        "observations" text NULL,
        "depressurization_time_before_firing" real NULL,
        "computed_pressure_before_firing" real NULL,
        "fsec_version_id" char(32) NOT NULL,
        FOREIGN KEY ("fsec_version_id") REFERENCES "FSEC" ("version_uuid") DEFERRABLE INITIALLY DEFERRED
    )''',
    '''CREATE INDEX IF NOT EXISTS "DEPRESSURIZATION_STEP_fsec_version_id_af90f084" ON "DEPRESSURIZATION_STEP" ("fsec_version_id")''',

    '''CREATE TABLE IF NOT EXISTS "REPRESSURIZATION_STEP" (
        "uuid" char(32) NOT NULL PRIMARY KEY,
        "operator" text NULL,
        "date_of_fulfilment" date NULL,
        "pressure_gauge" real NULL,
        "enclosure_pressure_measured" real NULL,
        "observations" text NULL,
        "fsec_version_id" char(32) NOT NULL,
        FOREIGN KEY ("fsec_version_id") REFERENCES "FSEC" ("version_uuid") DEFERRABLE INITIALLY DEFERRED
    )''',
    '''CREATE INDEX IF NOT EXISTS "REPRESSURIZATION_STEP_fsec_version_id_1895a6ce" ON "REPRESSURIZATION_STEP" ("fsec_version_id")''',

    '''CREATE TABLE IF NOT EXISTS "AIRTIGHTNESS_TEST_LP_STEP" (
        "uuid" char(32) NOT NULL PRIMARY KEY,
        "leak_rate_dtri" text NULL,
        "gas_type" text NULL,
        "experiment_pressure" real NULL,
        "airtightness_test_duration" real NULL,
        "operator" text NULL,
        "date_of_fulfilment" date NULL,
        "fsec_version_id" char(32) NOT NULL,
        FOREIGN KEY ("fsec_version_id") REFERENCES "FSEC" ("version_uuid") DEFERRABLE INITIALLY DEFERRED
    )''',
    '''CREATE INDEX IF NOT EXISTS "AIRTIGHTNESS_TEST_LP_STEP_fsec_version_id_fbb633e3" ON "AIRTIGHTNESS_TEST_LP_STEP" ("fsec_version_id")''',
]

with connection.cursor() as cursor:
    cursor.execute('PRAGMA foreign_keys = OFF')

    for sql in SQL_STATEMENTS:
        try:
            cursor.execute(sql)
            print(f"✓ Exécuté: {sql[:80]}...")
        except Exception as e:
            print(f"✗ Erreur: {sql[:80]}...")
            print(f"  {e}")

    cursor.execute('PRAGMA foreign_keys = ON')

print("\n✓ Toutes les tables ont été créées!")
