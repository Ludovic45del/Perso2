import math

import pandas as pd
from numpy.compat import basestring

from cible.domain.stock.models.consumables_glues_bean import ConsumablesGluesBean
from cible.domain.stock.models.inventory_basic_parts_catalog_bean import (
    InventoryBasicPartsCatalogBean,
)
from cible.domain.stock.models.inventory_ec_structuring_bean import (
    InventoryEcStructuringBean,
)
from cible.domain.stock.models.inventory_lmj_bean import InventoryLmjBean
from cible.domain.stock.models.inventory_omega_bean import InventoryOmegaBean
from cible.domain.stock.models.other_consumables_bean import OtherConsumablesBean
from cible.domain.stock.models.special_structuring_bean import SpecialStructuringBean
from cible.domain.stock.models.structuring_bean import StructuringBean
from cible.domain.stock.services.consumables_service import (
    create_consumables_glues_from_excel_sheet,
    create_other_consumables_from_excel_sheet,
)
from cible.domain.stock.services.inventory_service import (
    create_inventory_basic_parts_catalog_from_excel_sheet,
    create_inventory_ec_structuring_from_excel_sheet,
    create_inventory_lmj_from_excel_sheet,
    create_inventory_omega_from_excel_sheet,
)
from cible.domain.stock.services.structuring_service import (
    create_special_structuring_from_excel_sheet,
    create_structuring_from_excel_sheet,
)
from cible.exceptions.stock_creation_exception import StockCreationException
from cible.repository.stock.repositories.consumables_repository import (
    ConsumablesRepository,
)
from cible.repository.stock.repositories.inventory_repository import InventoryRepository
from cible.repository.stock.repositories.structuring_repository import (
    StructuringRepository,
)


def checkIfEmpty(row, type) -> str:
    if isinstance(row[type], basestring):
        return row[type]
    elif math.isnan(row[type]):
        return ""


def create_consumables_glues_from_excel_file(excel_sheet) -> None:

    for _, row in excel_sheet.iterrows():
        try:
            consumables_glues_bean = ConsumablesGluesBean(
                item=row["article"],
                stocks=row["stock"],
                unit=row["unite"],
                reference=row["reference"],
                buyingType=row["type_d_achat"],
                supplier=row["fournisseur"],
                expiryDate=row["date_de_peremption"],
                uuid="None",
            )
            create_consumables_glues_from_excel_sheet(
                ConsumablesRepository(), consumables_glues_bean
            )
        except Exception:
            raise StockCreationException(row.name, "Colles Consommables")


def create_other_consumables_from_excel_file(excel_sheet) -> None:
    for _, row in excel_sheet.iterrows():
        try:
            other_consumables_bean = OtherConsumablesBean(
                item=row["article"],
                stocks=row["stock"],
                unit=row["unite"],
                reference=row["reference"],
                buyingType=row["type_d_achat"],
                supplier=row["fournisseur"],
                uuid="None",
            )
            create_other_consumables_from_excel_sheet(
                ConsumablesRepository(), other_consumables_bean
            )
        except Exception:
            raise StockCreationException(row.name, "Autres Consommables")


def create_inventory_basic_parts_catalog_from_excel_file(excel_sheet) -> None:

    for _, row in excel_sheet.iterrows():
        try:
            inventory_basic_parts_catalog_bean = InventoryBasicPartsCatalogBean(
                uuid="None",
                exitDate=row["date_de_sortie"],
                deliveryDate=row["date_de_livraison"],
                boxNumberOrBoxDescription=row["numero_de_boite_ou_descriptif_boite"],
                elementName=row["nom_element"],
                availability=row["disponibilite"],
                usedCampaign=row["campagne_utilisee"],
                fsec=row["edifice_cible"],
            )
            create_inventory_basic_parts_catalog_from_excel_sheet(
                InventoryRepository(), inventory_basic_parts_catalog_bean
            )
        except Exception:
            raise StockCreationException(row.name, "Catalogue Pièce Elementaires")


def create_inventory_ec_structuring_from_excel_file(excel_sheet) -> None:
    for _, row in excel_sheet.iterrows():
        try:
            inventory_ec_structuring_bean = InventoryEcStructuringBean(
                uuid="None",
                item=row["article"],
                stocks=row["stock"],
                unit=row["unite"],
                reference=row["reference"],
                buyingType=row["type_d_achat"],
                supplier=row["fournisseur"],
                fsec=row["edifice_cible"],
            )
            create_inventory_ec_structuring_from_excel_sheet(
                InventoryRepository(), inventory_ec_structuring_bean
            )
        except Exception:
            raise StockCreationException(row.name, "Structuration EC")


def create_inventory_lmj_from_excel_file(excel_sheet) -> None:
    for _, row in excel_sheet.iterrows():
        try:
            inventory_lmj_bean = InventoryLmjBean(
                uuid="None",
                localisation=row["emplacement"],
                deliveryDate=row["date_de_livraison"],
                exitDate=row["date_de_sortie"],
                iec=row["iec"],
                campaignDtriNumber=row["numero_campagne_dtri"],
                targetsOrElementNumber=row["description_cibles_ou_elements"],
                digitsIfUntaggedElement=row["nombre_si_elements_non_marque"],
                boxNumberOrBoxDescription=row["numero_de_boite_ou_descriptif_boite"],
                elementsOrTargetDescription=row["numero_cible_ou_element"],
                fsec=row["edifice_cible"],
            )
            create_inventory_lmj_from_excel_sheet(
                InventoryRepository(), inventory_lmj_bean
            )
        except Exception:
            raise StockCreationException(row.name, "Inventaire LMJ")


def create_inventory_omega_from_excel_file(excel_sheet) -> None:
    for _, row in excel_sheet.iterrows():
        try:
            inventory_omega_bean = InventoryOmegaBean(
                uuid="None",
                localisation=row["emplacement"],
                deliveryDate=row["date_de_livraison"],
                exitDate=row["date_de_sortie"],
                iec=row["iec"],
                drmnCampaignNumber=row["numero_campagne_drmn"],
                targetsOrElementNumber=row["description_cibles_ou_elements"],
                digitsIfUntaggedElement=row["nombre_si_elements_non_marque"],
                boxNumberOrBoxDescription=row["numero_de_boite_ou_descriptif_boite"],
                elementsOrTargetDescription=row["numero_cible_ou_element"],
                fsec=row["edifice_cible"],
            )
            create_inventory_omega_from_excel_sheet(
                InventoryRepository(), inventory_omega_bean
            )
        except Exception:
            raise StockCreationException(row.name, "Inventaire OMEGA")


def create_structuring_from_excel_file(excel_sheet) -> None:
    for _, row in excel_sheet.iterrows():
        try:
            structuring_bean = StructuringBean(
                uuid="None",
                structuringNumber=row["numero_structuration"],
                comments=row["remarques"],
                localisation=row["emplacement"],
                usageDate=row["date_d_utilisation"],
                pamsNumber=row["numero_pams"],
                fulfillmentDate=row["date_realisation"],
                who=row["qui"],
                fsec=row["edifice_cible"],
            )
            create_structuring_from_excel_sheet(
                StructuringRepository(), structuring_bean
            )
        except Exception:
            raise StockCreationException(row.name, "Structuration")


def create_special_structuring_from_excel_file(excel_sheet) -> None:
    for _, row in excel_sheet.iterrows():
        try:
            special_structuring_bean = SpecialStructuringBean(
                uuid="None",
                structuringNumber=row["numero_structuration"],
                comments=row["remarques"],
                localisation=row["emplacement"],
                usageDate=row["date_d_utilisation"],
                pamsNumber=row["numero_pams"],
                fulfillmentDate=row["date_realisation"],
                who=row["qui"],
                fsec=row["edifice_cible"],
                materialsMat=row["materiaux_mat"],
            )
            create_special_structuring_from_excel_sheet(
                StructuringRepository(), special_structuring_bean
            )
        except Exception:
            raise StockCreationException(row.name, "Structuration Spéciales")


# def create_transfers_from_excel_file(excel_sheet) -> None:
#     return None


def upload_and_process_excel_file(excel_file) -> None:

    create_consumables_glues_from_excel_file(
        pd.read_excel(
            excel_file.file, sheet_name="colles_consommables", na_filter=False
        )
    )
    create_other_consumables_from_excel_file(
        pd.read_excel(
            excel_file.file, sheet_name="autres_consommables", na_filter=False
        )
    )
    create_inventory_basic_parts_catalog_from_excel_file(
        pd.read_excel(
            excel_file.file, sheet_name="catalogue_pieces_elementaires", na_filter=False
        )
    )
    create_inventory_ec_structuring_from_excel_file(
        pd.read_excel(excel_file.file, sheet_name="structuration_ec", na_filter=False)
    )
    create_inventory_lmj_from_excel_file(
        pd.read_excel(excel_file.file, sheet_name="inventaire_lmj", na_filter=False)
    )
    create_inventory_omega_from_excel_file(
        pd.read_excel(excel_file.file, sheet_name="inventaire_omega", na_filter=False)
    )
    create_structuring_from_excel_file(
        pd.read_excel(excel_file.file, sheet_name="structuration", na_filter=False)
    )
    create_special_structuring_from_excel_file(
        pd.read_excel(
            excel_file.file, sheet_name="structuration_speciale", na_filter=False
        )
    )
    # create_transfers_from_excel_file(pd.read_excel(excel_file.file,
    # sheet_name="mouvements", na_filter=False))
