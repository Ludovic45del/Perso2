from django.core.management.base import BaseCommand

from cible.management.commands.database_util import insert_csv_into_table


class Command(BaseCommand):
    help = "Initialize database with reference data"

    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE("=== Initializing CAMPAIGN referentials ==="))
        
        # CAMPAIGN Referentials (ordre important : pas de FK)
        insert_csv_into_table(
            self,
            "CAMPAIGN_STATUS",
            "cible/management/commands/campaign/campaign_status.csv",
        )
        insert_csv_into_table(
            self,
            "CAMPAIGN_TYPES",
            "cible/management/commands/campaign/campaign_types.csv",
        )
        insert_csv_into_table(
            self,
            "CAMPAIGN_INSTALLATIONS",
            "cible/management/commands/campaign/campaign_installations.csv",
        )
        insert_csv_into_table(
            self,
            "CAMPAIGN_ROLES",
            "cible/management/commands/campaign/campaign_roles.csv",
        )
        insert_csv_into_table(
            self,
            "CAMPAIGN_DOCUMENT_TYPES",
            "cible/management/commands/campaign/campaign_document_types.csv",
        )
        insert_csv_into_table(
            self,
            "CAMPAIGN_DOCUMENT_SUBTYPES",
            "cible/management/commands/campaign/campaign_document_subtypes.csv",
        )

        self.stdout.write(self.style.NOTICE("=== Initializing FSEC referentials ==="))
        
        # FSEC Referentials (ordre important : pas de FK)
        insert_csv_into_table(
            self,
            "FSEC_CATEGORY",
            "cible/management/commands/fsec/fsec_category.csv",
        )
        insert_csv_into_table(
            self,
            "FSEC_STATUS",
            "cible/management/commands/fsec/fsec_status.csv",
        )
        insert_csv_into_table(
            self,
            "FSEC_RACK",
            "cible/management/commands/fsec/fsec_racks.csv",
        )
        insert_csv_into_table(
            self,
            "FSEC_ROLES",
            "cible/management/commands/fsec/fsec_roles.csv",
        )
        insert_csv_into_table(
            self,
            "FSEC_DOCUMENT_TYPES",
            "cible/management/commands/fsec/fsec_document_types.csv",
        )
        insert_csv_into_table(
            self,
            "FSEC_DOCUMENT_SUBTYPES",
            "cible/management/commands/fsec/fsec_document_subtypes.csv",
        )

        self.stdout.write(self.style.NOTICE("=== Initializing STEPS referentials ==="))
        
        # STEPS Referentials
        insert_csv_into_table(
            self,
            "METROLOGY_MACHINE",
            "cible/management/commands/fsec/metrology_machine.csv",
        )
        insert_csv_into_table(
            self,
            "ASSEMBLY_BENCH",
            "cible/management/commands/fsec/fsec_assembly_benches.csv",
        )

        self.stdout.write(self.style.SUCCESS("=== Referential data initialized successfully ==="))
        self.stdout.write(self.style.WARNING(
            "NOTE: CAMPAIGN, FSEC, CAMPAIGN_TEAMS, CAMPAIGN_DOCUMENTS, FSEC_TEAMS, "
            "FSEC_DOCUMENTS and STEPS data require existing parent records. "
            "Use 'python manage.py demo' to insert demo data with proper FK relationships."
        ))
