from cible.domain.fsec.interface.i_fsec_team_repository import IFsecTeamRepository
from cible.domain.fsec.models.fsec_team_bean import FsecTeamBean


def get_team_by_fsec_uuid(
    uuid: str, repository: IFsecTeamRepository
) -> list[FsecTeamBean]:
    return repository.get_team_by_fsec_uuid(uuid)
