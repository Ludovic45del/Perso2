import abc

from cible.domain.stock.models.consumables_glues_bean import ConsumablesGluesBean
from cible.domain.stock.models.other_consumables_bean import OtherConsumablesBean


class IConsumablesRepository:

    @abc.abstractmethod
    def get_all_consumables_glues(self) -> list[ConsumablesGluesBean]:
        raise NotImplementedError

    @abc.abstractmethod
    def get_all_other_consumables(self) -> list[OtherConsumablesBean]:
        raise NotImplementedError

    @abc.abstractmethod
    def delete_consumables_glues(self, uuid) -> list[ConsumablesGluesBean]:
        raise NotImplementedError

    @abc.abstractmethod
    def delete_other_consumables(self, uuid) -> list[OtherConsumablesBean]:
        raise NotImplementedError

    @abc.abstractmethod
    def create_consumables_glues(
        self, consumables_glues_bean: ConsumablesGluesBean
    ) -> list[ConsumablesGluesBean]:
        raise NotImplementedError

    @abc.abstractmethod
    def create_other_consumables(
        self, other_consumables_bean: OtherConsumablesBean
    ) -> list[OtherConsumablesBean]:
        raise NotImplementedError

    @abc.abstractmethod
    def create_consumables_glues_from_excel_sheet(
        self, consumables_glues_bean: ConsumablesGluesBean
    ) -> None:
        raise NotImplementedError

    @abc.abstractmethod
    def create_other_consumables_from_excel_sheet(
        self, other_consumables_bean: OtherConsumablesBean
    ) -> None:
        raise NotImplementedError

    @abc.abstractmethod
    def add_additional_comment_to_other_consumables(
        self, comment: str, object_uuid: str
    ) -> None:
        raise NotImplementedError

    @abc.abstractmethod
    def add_additional_comment_to_consumables_glues(
        self, comment: str, object_uuid: str
    ) -> None:
        raise NotImplementedError
