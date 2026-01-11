import abc

from cible.domain.stock.models.special_structuring_bean import SpecialStructuringBean
from cible.domain.stock.models.structuring_bean import StructuringBean


class IStructuringRepository:

    @abc.abstractmethod
    def get_all_structuring(self) -> list[StructuringBean]:
        raise NotImplementedError

    @abc.abstractmethod
    def get_all_special_structuring(self) -> list[SpecialStructuringBean]:
        raise NotImplementedError

    @abc.abstractmethod
    def delete_structuring(self, uuid) -> list[StructuringBean]:
        raise NotImplementedError

    @abc.abstractmethod
    def delete_special_structuring(self, uuid) -> list[SpecialStructuringBean]:
        raise NotImplementedError

    @abc.abstractmethod
    def create_structuring(
        self, structuring_bean: StructuringBean
    ) -> list[StructuringBean]:
        raise NotImplementedError

    @abc.abstractmethod
    def create_special_structuring(
        self, special_structuring_bean: SpecialStructuringBean
    ) -> list[SpecialStructuringBean]:
        raise NotImplementedError

    @abc.abstractmethod
    def create_structuring_from_excel_sheet(
        self, structuring_bean: StructuringBean
    ) -> None:
        raise NotImplementedError

    @abc.abstractmethod
    def create_special_structuring_from_excel_sheet(
        self, special_structuring_bean: SpecialStructuringBean
    ) -> None:
        raise NotImplementedError

    @abc.abstractmethod
    def add_additional_comment_to_structuring(
        self, comment: str, object_uuid: str
    ) -> None:
        raise NotImplementedError

    @abc.abstractmethod
    def add_additional_comment_to_special_structuring(
        self, comment: str, object_uuid: str
    ) -> None:
        raise NotImplementedError
