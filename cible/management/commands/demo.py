from django.core import management
from django.core.management.base import BaseCommand

from cible.management.commands.database_util import insert_csv_into_table


class Command(BaseCommand):
    help = "Initialize demo data (requires initdb to be run first)"

    def handle(self, *args, **options):
        # Initialize referential data first
        management.call_command("initdb")

        self.stdout.write(self.style.NOTICE("=== Inserting CAMPAIGN demo data ==="))

        # CAMPAIGN - Requires CAMPAIGN referentials to exist
        # Note: campaigns.csv must be created in cible/tests/template/
        try:
            insert_csv_into_table(
                self, "CAMPAIGN", "cible/tests/template/campaigns.csv"
            )
        except Exception as e:
            self.stderr.write(
                self.style.WARNING(f"Skipping CAMPAIGN: {e}")
            )

        # CAMPAIGN_TEAMS - Requires CAMPAIGN to exist
        insert_csv_into_table(
            self,
            "CAMPAIGN_TEAMS",
            "cible/management/commands/campaign/campaign_teams.csv",
        )

        # CAMPAIGN_DOCUMENTS - Requires CAMPAIGN to exist
        insert_csv_into_table(
            self,
            "CAMPAIGN_DOCUMENTS",
            "cible/management/commands/campaign/campaign_documents.csv",
        )

        self.stdout.write(self.style.NOTICE("=== Inserting FSEC demo data ==="))

        # FSEC - Requires FSEC referentials to exist
        # Note: fsec.csv must be created in cible/tests/template/
        try:
            insert_csv_into_table(
                self, "FSEC", "cible/tests/template/fsec.csv"
            )
        except Exception as e:
            self.stderr.write(
                self.style.WARNING(f"Skipping FSEC: {e}")
            )

        # FSEC_TEAMS - Requires FSEC to exist
        insert_csv_into_table(
            self,
            "FSEC_TEAMS",
            "cible/management/commands/fsec/fsec_teams.csv",
        )

        # FSEC_DOCUMENTS - Requires FSEC to exist
        insert_csv_into_table(
            self,
            "FSEC_DOCUMENTS",
            "cible/management/commands/fsec/fsec_documents.csv",
        )

        self.stdout.write(self.style.NOTICE("=== Inserting STEPS demo data ==="))

        # STEPS - Requires FSEC to exist (via fsec_version_id FK)
        insert_csv_into_table(
            self,
            "ASSEMBLY_STEP",
            "cible/management/commands/fsec/steps/assembly_step.csv",
        )
        insert_csv_into_table(
            self,
            "METROLOGY_STEP",
            "cible/management/commands/fsec/steps/metrology_step.csv",
        )
        insert_csv_into_table(
            self,
            "PICTURES_STEP",
            "cible/management/commands/fsec/steps/pictures_step.csv",
        )
        insert_csv_into_table(
            self,
            "SEALING_STEP",
            "cible/management/commands/fsec/steps/sealing_step.csv",
        )

        self.stdout.write(
            self.style.SUCCESS("=== Demo data initialized successfully ===")
        )
