import abc

from cible.domain.fsec.models.referential.fsec_category_bean import FsecCategoryBean


class IFsecCategoryRepository:

    @abc.abstractmethod
    def get_fsec_categories(self) -> list[FsecCategoryBean]:
        raise NotImplementedError
