from cible.domain.stock.interface.i_consumables_repository import IConsumablesRepository
from cible.domain.stock.models.consumables_glues_bean import ConsumablesGluesBean
from cible.domain.stock.models.other_consumables_bean import OtherConsumablesBean


def get_all_consumables_glues(
    repository: IConsumablesRepository,
) -> list[ConsumablesGluesBean]:
    return repository.get_all_consumables_glues()


def get_all_other_consumables(
    repository: IConsumablesRepository,
) -> list[OtherConsumablesBean]:
    return repository.get_all_other_consumables()


def delete_consumables_glues(
    uuid: str, repository: IConsumablesRepository
) -> list[ConsumablesGluesBean]:
    return repository.delete_consumables_glues(uuid)


def delete_other_consumables(
    uuid: str, repository: IConsumablesRepository
) -> list[OtherConsumablesBean]:
    return repository.delete_other_consumables(uuid)


def create_consumables_glues(
    repository: IConsumablesRepository, consumables_glues_bean: ConsumablesGluesBean
) -> list[ConsumablesGluesBean]:
    return repository.create_consumables_glues(consumables_glues_bean)


def create_other_consumables(
    repository: IConsumablesRepository, other_consumables_bean: OtherConsumablesBean
) -> list[OtherConsumablesBean]:
    return repository.create_other_consumables(other_consumables_bean)


def create_consumables_glues_from_excel_sheet(
    repository: IConsumablesRepository, consumables_glues_bean: ConsumablesGluesBean
) -> None:
    return repository.create_consumables_glues_from_excel_sheet(consumables_glues_bean)


def create_other_consumables_from_excel_sheet(
    repository: IConsumablesRepository, other_consumables_bean: OtherConsumablesBean
) -> None:
    return repository.create_other_consumables_from_excel_sheet(other_consumables_bean)


def add_additional_comment_to_consumables_glues(
    repository: IConsumablesRepository, comment: str, object_uuid: str
) -> None:
    return repository.add_additional_comment_to_consumables_glues(comment, object_uuid)


def add_additional_comment_to_other_consumables(
    repository: IConsumablesRepository, comment: str, object_uuid: str
) -> None:
    return repository.add_additional_comment_to_other_consumables(comment, object_uuid)
