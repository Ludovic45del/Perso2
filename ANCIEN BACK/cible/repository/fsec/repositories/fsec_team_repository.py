from cible.domain.fsec.interface.i_fsec_team_repository import IFsecTeamRepository
from cible.domain.fsec.models.fsec_team_bean import FsecTeamBean
from cible.mapper.fsec.fsec_team_mapper import fsec_team_mapper_entity_to_bean
from cible.repository.fsec.models.fsec_team import FsecTeamEntity


class FsecTeamRepository(IFsecTeamRepository):

    def get_team_by_fsec_uuid(self, uuid) -> list[FsecTeamBean]:
        team = FsecTeamEntity.objects.filter(fsec=uuid)
        if len(team) == 0:
            return []
        else:
            return list(
                map(
                    lambda x: fsec_team_mapper_entity_to_bean(x),
                    team,
                )
            )
