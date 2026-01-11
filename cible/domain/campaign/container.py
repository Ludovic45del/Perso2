"""
Container d'injection de dépendances pour le module Campaign.

Ce module centralise la création des repositories et services,
permettant une meilleure testabilité et un couplage réduit.

Usage:
    from cible.domain.campaign.container import CampaignContainer
    
    container = CampaignContainer()
    campaign_service = container.campaign_service()
"""
from typing import Callable, Dict, Any

from cible.domain.campaign.interface.campaign_repository import (
    ICampaignRepository,
    ICampaignTeamsRepository,
    ICampaignDocumentsRepository,
)
from cible.repository.campaign.repositories.campaign_repository import CampaignRepository
from cible.repository.campaign.repositories.campaign_teams_repository import CampaignTeamsRepository
from cible.repository.campaign.repositories.campaign_documents_repository import CampaignDocumentsRepository


class CampaignContainer:
    """
    Container DI pour le module Campaign.
    
    Centralise la création des repositories pour faciliter
    le remplacement par des mocks en tests.
    """
    
    def __init__(self):
        self._instances: Dict[str, Any] = {}
        self._factories: Dict[str, Callable] = {
            "campaign_repository": lambda: CampaignRepository(),
            "campaign_teams_repository": lambda: CampaignTeamsRepository(),
            "campaign_documents_repository": lambda: CampaignDocumentsRepository(),
        }
    
    def campaign_repository(self) -> ICampaignRepository:
        """Retourne le repository Campaign (singleton)."""
        return self._get_or_create("campaign_repository")
    
    def campaign_teams_repository(self) -> ICampaignTeamsRepository:
        """Retourne le repository CampaignTeams (singleton)."""
        return self._get_or_create("campaign_teams_repository")
    
    def campaign_documents_repository(self) -> ICampaignDocumentsRepository:
        """Retourne le repository CampaignDocuments (singleton)."""
        return self._get_or_create("campaign_documents_repository")
    
    def _get_or_create(self, name: str) -> Any:
        """Lazy loading avec mise en cache."""
        if name not in self._instances:
            self._instances[name] = self._factories[name]()
        return self._instances[name]
    
    def override(self, name: str, instance: Any) -> None:
        """
        Remplace une instance par un mock (pour les tests).
        
        Usage:
            container.override("campaign_repository", mock_repo)
        """
        self._instances[name] = instance
    
    def reset(self) -> None:
        """Réinitialise toutes les instances (pour les tests)."""
        self._instances.clear()


# Instance globale (singleton pattern)
_container: CampaignContainer | None = None


def get_campaign_container() -> CampaignContainer:
    """Retourne le container global (lazy initialization)."""
    global _container
    if _container is None:
        _container = CampaignContainer()
    return _container


def reset_campaign_container() -> None:
    """Réinitialise le container global (pour les tests)."""
    global _container
    if _container is not None:
        _container.reset()
    _container = None
