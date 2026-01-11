import abc
from uuid import UUID

from cible.api.fsec.models.fsec_api import FsecApi
from cible.domain.fsec.models.fsec_active_bean import FsecActiveBean
from cible.domain.fsec.models.fsec_base_bean import FsecBaseBean
from cible.domain.fsec.models.fsec_bean import FsecBean
from cible.domain.fsec.models.fsec_document_bean import FsecDocumentBean
from cible.domain.fsec.models.fsec_team_bean import FsecTeamBean
from cible.domain.fsec.models.steps.fsec_assembly_step_bean import FsecAssemblyStepBean
from cible.domain.fsec.models.steps.fsec_metrology_step_bean import (
    FsecMetrologyStepBean,
)


class IFsecRepository:

    @abc.abstractmethod
    def get_all_fsecs(self) -> list[FsecApi]:
        raise NotImplementedError

    @abc.abstractmethod
    def get_fsec_by_uuid(self, uuid) -> FsecBean:
        raise NotImplementedError

    @abc.abstractmethod
    def get_fsec_base_by_uuid(self, uuid) -> FsecBaseBean:
        raise NotImplementedError

    @abc.abstractmethod
    def create_fsec(self, fsec: FsecBean) -> FsecApi:
        raise NotImplementedError

    @abc.abstractmethod
    def update_fsec(
        self, fsec: FsecActiveBean
    ) -> (FsecActiveBean, list[FsecTeamBean], list[FsecDocumentBean]):
        raise NotImplementedError

    @abc.abstractmethod
    def does_fsec_exist_by_name_and_campaign(
        self, name: str, campaign_uuid: UUID
    ) -> bool:
        raise NotImplementedError

    @abc.abstractmethod
    def does_fsec_name_used(
        self, fsec_version_uuid: UUID, name: str, campaign_uuid
    ) -> bool:
        raise NotImplementedError

    @abc.abstractmethod
    def does_fsec_exist_by_version_uuid(self, version_uuid: str) -> bool:
        raise NotImplementedError

    @abc.abstractmethod
    def delete_fsec(self, version_uuid: str) -> None:
        raise NotImplementedError

    @abc.abstractmethod
    def calculate_fsec_increment(self, name) -> str:
        raise

    @abc.abstractmethod
    def get_all_fsecs_by_campaign_uuid(self, campaign_uuid: str) -> list[FsecApi]:
        raise NotImplementedError

    @abc.abstractmethod
    def return_to_assembly_step(
        self, assembly_step: FsecAssemblyStepBean, fsec_uuid: str
    ) -> FsecBean:
        raise NotImplementedError

    @abc.abstractmethod
    def return_to_metrology_step(
        self, metrology_step: FsecMetrologyStepBean, fsec_uuid: str
    ) -> FsecBean:
        raise NotImplementedError

    @abc.abstractmethod
    def change_depressurization_status(self, fsec_uuid: str) -> None:
        raise NotImplementedError

    @abc.abstractmethod
    def return_to_repressurization_step(self, fsec_uuid: str) -> FsecBean:
        raise NotImplementedError

    @abc.abstractmethod
    def return_to_re_assembly_step(self, fsec_uuid: str) -> FsecBean:
        raise NotImplementedError
