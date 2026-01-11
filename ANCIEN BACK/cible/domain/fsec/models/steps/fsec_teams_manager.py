from cible.domain.fsec.models.fsec_team_bean import FsecTeamBean
from cible.domain.fsec.models.referential.fsec_role_bean import FsecRoleBean


class FsecTeamManager:
    REQUIRED_ROLES = {}  # Doit être défini dans la classe enfant

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fsecTeam = []

    def set_team(self, teams: list[FsecTeamBean]):
        if not self.REQUIRED_ROLES:
            raise AttributeError(
                f"{self.__class__.__name__} must define REQUIRED_ROLES."
            )

        # Filtrer les équipes présentes dans teams qui ont un rôle dans REQUIRED_ROLES
        filtered_teams = {
            team.role.label: team
            for team in teams
            if team.role.label in self.REQUIRED_ROLES.values()
        }

        # Ajouter les rôles manquants avec des valeurs par défaut
        for role_id, role_label in self.REQUIRED_ROLES.items():
            if role_label not in filtered_teams:
                filtered_teams[role_label] = FsecTeamBean(
                    role=FsecRoleBean(label=role_label, id=role_id),
                    name="",
                )

        # Convertir en liste et stocker dans fsecTeam
        self.fsecTeam = list(filtered_teams.values())
