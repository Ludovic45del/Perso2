"""Interfaces FSEC - Exports."""
from cible.domain.fsec.interface.fsec_repository import (
    IFsecDocumentsRepository,
    IFsecRepository,
    IFsecTeamsRepository,
)

__all__ = [
    "IFsecRepository",
    "IFsecTeamsRepository",
    "IFsecDocumentsRepository",
]
