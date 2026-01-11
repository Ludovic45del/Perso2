from cible.domain.stock.interface.i_structuring_repository import IStructuringRepository
from cible.domain.stock.models.special_structuring_bean import SpecialStructuringBean
from cible.domain.stock.models.structuring_bean import StructuringBean


def get_all_structuring(repository: IStructuringRepository) -> list[StructuringBean]:
    return repository.get_all_structuring()


def get_all_special_structuring(
    repository: IStructuringRepository,
) -> list[SpecialStructuringBean]:
    return repository.get_all_special_structuring()


def delete_structuring(
    uuid: str, repository: IStructuringRepository
) -> list[StructuringBean]:
    return repository.delete_structuring(uuid)


def delete_special_structuring(
    uuid: str, repository: IStructuringRepository
) -> list[SpecialStructuringBean]:
    return repository.delete_special_structuring(uuid)


def create_structuring(
    repository: IStructuringRepository, structuring_bean: StructuringBean
) -> list[StructuringBean]:
    return repository.create_structuring(structuring_bean)


def create_special_structuring(
    repository: IStructuringRepository, special_structuring_bean: SpecialStructuringBean
) -> list[SpecialStructuringBean]:
    return repository.create_special_structuring(special_structuring_bean)


def create_structuring_from_excel_sheet(
    repository: IStructuringRepository, structuring_bean: StructuringBean
) -> None:
    return repository.create_structuring_from_excel_sheet(structuring_bean)


def create_special_structuring_from_excel_sheet(
    repository: IStructuringRepository, special_structuring_bean: SpecialStructuringBean
) -> None:
    return repository.create_special_structuring_from_excel_sheet(
        special_structuring_bean
    )


def add_additional_comment_to_structuring(
    repository: IStructuringRepository, comment: str, object_uuid: str
) -> None:
    return repository.add_additional_comment_to_structuring(comment, object_uuid)


def add_additional_comment_to_special_structuring(
    repository: IStructuringRepository, comment: str, object_uuid: str
) -> None:
    return repository.add_additional_comment_to_special_structuring(
        comment, object_uuid
    )
