"""
Container d'injection de dépendances pour le module FSEC.

Ce module centralise la création des repositories et services,
permettant une meilleure testabilité et un couplage réduit.

Usage:
    from cible.domain.fsec.container import get_fsec_container
    
    container = get_fsec_container()
    fsec_repo = container.fsec_repository()
"""
from typing import Callable, Dict, Any

from cible.domain.fsec.interface.fsec_repository import (
    IFsecRepository,
    IFsecTeamsRepository,
    IFsecDocumentsRepository,
)
from cible.repository.fsec.repositories.fsec_repository import FsecRepository
from cible.repository.fsec.repositories.fsec_teams_repository import FsecTeamsRepository
from cible.repository.fsec.repositories.fsec_documents_repository import FsecDocumentsRepository


class FsecContainer:
    """
    Container DI pour le module FSEC.
    
    Centralise la création des repositories pour faciliter
    le remplacement par des mocks en tests.
    """
    
    def __init__(self):
        self._instances: Dict[str, Any] = {}
        self._factories: Dict[str, Callable] = {
            "fsec_repository": lambda: FsecRepository(),
            "fsec_teams_repository": lambda: FsecTeamsRepository(),
            "fsec_documents_repository": lambda: FsecDocumentsRepository(),
        }
    
    def fsec_repository(self) -> IFsecRepository:
        """Retourne le repository FSEC (singleton)."""
        return self._get_or_create("fsec_repository")
    
    def fsec_teams_repository(self) -> IFsecTeamsRepository:
        """Retourne le repository FsecTeams (singleton)."""
        return self._get_or_create("fsec_teams_repository")
    
    def fsec_documents_repository(self) -> IFsecDocumentsRepository:
        """Retourne le repository FsecDocuments (singleton)."""
        return self._get_or_create("fsec_documents_repository")
    
    def _get_or_create(self, name: str) -> Any:
        """Lazy loading avec mise en cache."""
        if name not in self._instances:
            self._instances[name] = self._factories[name]()
        return self._instances[name]
    
    def override(self, name: str, instance: Any) -> None:
        """
        Remplace une instance par un mock (pour les tests).
        
        Usage:
            container.override("fsec_repository", mock_repo)
        """
        self._instances[name] = instance
    
    def reset(self) -> None:
        """Réinitialise toutes les instances (pour les tests)."""
        self._instances.clear()


# Instance globale (singleton pattern)
_container: FsecContainer | None = None


def get_fsec_container() -> FsecContainer:
    """Retourne le container global (lazy initialization)."""
    global _container
    if _container is None:
        _container = FsecContainer()
    return _container


def reset_fsec_container() -> None:
    """Réinitialise le container global (pour les tests)."""
    global _container
    if _container is not None:
        _container.reset()
    _container = None
