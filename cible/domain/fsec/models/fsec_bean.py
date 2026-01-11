"""Bean Fsec - FSEC (Édifice Cible) principal avec versioning."""
from dataclasses import dataclass, field
from datetime import date, datetime
from typing import Optional, List


@dataclass
class FsecTeamMemberBean:
    """Bean représentant un membre d'équipe FSEC."""
    uuid: str = ""
    name: str = ""
    role_id: Optional[int] = None
    step_type: Optional[str] = None
    step_uuid: Optional[str] = None


@dataclass
class FsecDocumentBean:
    """Bean représentant un document FSEC."""
    uuid: str = ""
    name: str = ""
    path: str = ""
    subtype_id: Optional[int] = None
    step_type: Optional[str] = None
    step_uuid: Optional[str] = None


@dataclass
class FsecBean:
    """Bean représentant un FSEC avec versioning."""

    # Versioning
    version_uuid: str = ""
    fsec_uuid: str = ""
    version_number: int = 1
    is_current_version: bool = True

    # Foreign Keys
    campaign_id: Optional[str] = None
    status_id: Optional[int] = None
    category_id: Optional[int] = None
    rack_id: Optional[int] = None

    # Champs de base
    name: str = ""
    comments: Optional[str] = None
    last_updated: Optional[datetime] = None
    is_active: bool = True
    created_at: Optional[datetime] = None

    # Workflow
    current_step: Optional[str] = None

    # Audit
    created_by: Optional[str] = None
    updated_by: Optional[str] = None

    # Champs workflow
    delivery_date: Optional[date] = None
    shooting_date: Optional[date] = None
    preshooting_pressure: Optional[float] = None
    experience_srxx: Optional[str] = None
    localisation: Optional[str] = None
    depressurization_failed: Optional[bool] = None

    # Legacy fields (used by old frontend)
    embase: Optional[str] = None
    restitution_date: Optional[date] = None

    # Relations (Nested) - Typed lists
    teams: List[FsecTeamMemberBean] = field(default_factory=list)
    documents: List[FsecDocumentBean] = field(default_factory=list)

