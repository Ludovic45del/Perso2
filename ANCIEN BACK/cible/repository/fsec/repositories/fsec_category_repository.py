from cible.domain.fsec.interface.i_fsec_category_repository import (
    IFsecCategoryRepository,
)
from cible.domain.fsec.models.referential.fsec_category_bean import FsecCategoryBean
from cible.mapper.fsec.fsec_mapper import fsec_category_mapper_entity_to_bean
from cible.repository.fsec.models.referential.fsec_category import FsecCategoryEntity


class FsecCategoryRepository(IFsecCategoryRepository):

    def get_fsec_categories(self) -> list[FsecCategoryBean]:
        types = FsecCategoryEntity.objects.all()
        if len(types) == 0:
            return []
        else:
            return list(
                map(
                    lambda x: fsec_category_mapper_entity_to_bean(x),
                    types,
                )
            )
