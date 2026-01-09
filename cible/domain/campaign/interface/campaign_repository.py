"""Interface ICampaignRepository - Repository abstrait pour Campaign."""
import abc
from typing import List, Optional

from cible.domain.campaign.models.campaign_bean import CampaignBean
from cible.domain.campaign.models.campaign_documents_bean import CampaignDocumentsBean
from cible.domain.campaign.models.campaign_teams_bean import CampaignTeamsBean


class ICampaignRepository(abc.ABC):
    """Interface abstraite pour le repository Campaign."""

    @abc.abstractmethod
    def create(self, bean: CampaignBean) -> CampaignBean:
        """Crée une nouvelle campagne."""
        raise NotImplementedError

    @abc.abstractmethod
    def get_by_uuid(self, uuid: str) -> Optional[CampaignBean]:
        """Récupère une campagne par son UUID."""
        raise NotImplementedError

    @abc.abstractmethod
    def get_all(self) -> List[CampaignBean]:
        """Récupère toutes les campagnes."""
        raise NotImplementedError

    @abc.abstractmethod
    def update(self, bean: CampaignBean) -> CampaignBean:
        """Met à jour une campagne."""
        raise NotImplementedError

    @abc.abstractmethod
    def delete(self, uuid: str) -> bool:
        """Supprime une campagne par son UUID."""
        raise NotImplementedError

    @abc.abstractmethod
    def exists_by_name_year_semester(
        self, name: str, year: int, semester: str
    ) -> bool:
        """Vérifie si une campagne existe avec ce triplet unique."""
        raise NotImplementedError

    @abc.abstractmethod
    def exists_duplicate(
        self, exclude_uuid: str, name: str, year: int, semester: str
    ) -> bool:
        """Vérifie si une AUTRE campagne existe avec ce triplet (exclut l'UUID donné)."""
        raise NotImplementedError


class ICampaignTeamsRepository(abc.ABC):
    """Interface abstraite pour le repository CampaignTeams."""

    @abc.abstractmethod
    def create(self, bean: CampaignTeamsBean) -> CampaignTeamsBean:
        """Crée un nouveau membre d'équipe."""
        raise NotImplementedError

    @abc.abstractmethod
    def get_by_uuid(self, uuid: str) -> Optional[CampaignTeamsBean]:
        """Récupère un membre d'équipe par son UUID."""
        raise NotImplementedError

    @abc.abstractmethod
    def get_by_campaign_uuid(self, campaign_uuid: str) -> List[CampaignTeamsBean]:
        """Récupère tous les membres d'une équipe de campagne."""
        raise NotImplementedError

    @abc.abstractmethod
    def update(self, bean: CampaignTeamsBean) -> CampaignTeamsBean:
        """Met à jour un membre d'équipe."""
        raise NotImplementedError

    @abc.abstractmethod
    def delete(self, uuid: str) -> bool:
        """Supprime un membre d'équipe par son UUID."""
        raise NotImplementedError


class ICampaignDocumentsRepository(abc.ABC):
    """Interface abstraite pour le repository CampaignDocuments."""

    @abc.abstractmethod
    def create(self, bean: CampaignDocumentsBean) -> CampaignDocumentsBean:
        """Crée un nouveau document."""
        raise NotImplementedError

    @abc.abstractmethod
    def get_by_uuid(self, uuid: str) -> Optional[CampaignDocumentsBean]:
        """Récupère un document par son UUID."""
        raise NotImplementedError

    @abc.abstractmethod
    def get_by_campaign_uuid(self, campaign_uuid: str) -> List[CampaignDocumentsBean]:
        """Récupère tous les documents d'une campagne."""
        raise NotImplementedError

    @abc.abstractmethod
    def update(self, bean: CampaignDocumentsBean) -> CampaignDocumentsBean:
        """Met à jour un document."""
        raise NotImplementedError

    @abc.abstractmethod
    def delete(self, uuid: str) -> bool:
        """Supprime un document par son UUID."""
        raise NotImplementedError
