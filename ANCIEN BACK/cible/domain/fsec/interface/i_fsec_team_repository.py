import abc

from cible.domain.fsec.models.fsec_team_bean import FsecTeamBean


class IFsecTeamRepository:

    @abc.abstractmethod
    def get_team_by_fsec_uuid(self, uuid) -> list[FsecTeamBean]:
        raise NotImplementedError
