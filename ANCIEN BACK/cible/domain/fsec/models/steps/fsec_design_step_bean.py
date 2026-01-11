from dataclasses import dataclass

from cible.domain.campaign.models.campaign_bean import CampaignBean
from cible.domain.fsec.models.fsec_document_bean import FsecDocumentBean
from cible.domain.fsec.models.fsec_team_bean import FsecTeamBean
from cible.domain.fsec.models.referential.fsec_status_bean import FsecStatusBean
from cible.domain.fsec.models.steps.fsec_base_step_bean import FsecBaseStep
from cible.domain.fsec.models.steps.fsec_documents_manager import FsecDocumentsManager
from cible.domain.fsec.models.steps.fsec_teams_manager import FsecTeamManager


@dataclass
class FsecDesignStepBean(FsecBaseStep, FsecTeamManager, FsecDocumentsManager):
    name: str
    comments: str
    campaign: CampaignBean = None
    fsecTeam: list[FsecTeamBean] = None
    fsecDocuments: list[FsecDocumentBean] = None

    REQUIRED_ROLES = {0: "RCE", 1: "MOE", 2: "IEC"}
    REQUIRED_SUBTYPES_DOCS = {
        0: "Visrad initial",
        1: "Vues",
        2: ".STP Métro",
        3: "Fiches Car",
        4: "Fiche de réception",
        5: "Gamme d’assemblage",
    }

    def get_next_step(self) -> FsecStatusBean | None:
        pass

    def get_previous_step(self) -> FsecStatusBean | None:
        return None

    def is_valid(self) -> bool:
        if not all(
            [
                self.name,
                self.comments,
                self.campaign,
                self.campaign.uuid,
                self.fsecTeam,
                self.fsecDocuments,
            ]
        ):
            return False

        team_names_valid = all(team.name.strip() for team in self.fsecTeam)
        team_roles_valid = all(
            role in {team.role.label for team in self.fsecTeam}
            for role in self.REQUIRED_ROLES
        )

        if not (team_names_valid and team_roles_valid):
            return False

        docs_paths_valid = all(doc.path.strip() for doc in self.fsecDocuments)
        docs_subtypes_valid = all(
            subtype in {doc.subtype.label for doc in self.fsecDocuments}
            for subtype in self.REQUIRED_SUBTYPES_DOCS
        )

        if not (docs_paths_valid and docs_subtypes_valid):
            return False

        return True
