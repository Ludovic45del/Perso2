from django.core import management
from django.core.management.base import BaseCommand

from cible.management.commands.database_util import insert_csv_into_table


class Command(BaseCommand):
    help = "Initialize demo data"

    def handle(self, *args, **options):
        management.call_command("initdb")

        insert_csv_into_table(self, "CAMPAIGN", "cible/tests/template/campaigns.csv")
        insert_csv_into_table(
            self,
            "CAMPAIGN_TEAMS",
            "cible/management/commands/campaign/campaign_teams.csv",
        )
        insert_csv_into_table(
            self,
            "CAMPAIGN_DOCUMENTS",
            "cible/management/commands/campaign/campaign_documents.csv",
        )
        insert_csv_into_table(
            self,
            "FSEC",
            "cible/tests/template/fsec.csv",
        )
        insert_csv_into_table(
            self,
            "STOCKS_CONSUMABLES_GLUES",
            "cible/management/commands/stocks/consumables/consumables_glues.csv",
        )
        insert_csv_into_table(
            self,
            "STOCKS_OTHER_CONSUMABLES",
            "cible/management/commands/stocks/consumables/other_consumables.csv",
        )
        insert_csv_into_table(
            self,
            "STOCKS_INVENTORY_EC_STRUCTURING",
            "cible/management/commands/stocks/inventory/inventory_ec_structuring.csv",
        )
        insert_csv_into_table(
            self,
            "STOCKS_INVENTORY_LMJ",
            "cible/management/commands/stocks/inventory/inventory_lmj.csv",
        )
        insert_csv_into_table(
            self,
            "STOCKS_INVENTORY_OMEGA",
            "cible/management/commands/stocks/inventory/inventory_omega.csv",
        )
        insert_csv_into_table(
            self,
            "STOCKS_INVENTORY_BASIC_PARTS",
            "cible/management/commands/stocks/inventory/inventory_basic_parts.csv",
        )
        insert_csv_into_table(
            self,
            "STOCKS_SPECIAL_STRUCTURING",
            "cible/management/commands/stocks/structuring/special_structuring.csv",
        )
        insert_csv_into_table(
            self,
            "STOCKS_STRUCTURING",
            "cible/management/commands/stocks/structuring/structuring.csv",
        )
        insert_csv_into_table(
            self,
            "STOCKS_TRANSFERS",
            "cible/management/commands/stocks/transfers.csv",
        )
