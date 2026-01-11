from cible.domain.fsec.interface.i_fsec_category_repository import (
    IFsecCategoryRepository,
)
from cible.domain.fsec.models.referential.fsec_category_bean import FsecCategoryBean


def get_fsec_categories(repository: IFsecCategoryRepository) -> list[FsecCategoryBean]:
    return repository.get_fsec_categories()
