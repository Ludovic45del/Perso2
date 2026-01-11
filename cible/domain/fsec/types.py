"""
Type definitions and enums for FSEC domain.

This module defines custom types, enums, and type aliases used across
the FSEC domain layer.
"""

from enum import Enum
from typing import Literal


class StepStatus(str, Enum):
    """Status of a workflow step."""

    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    VALIDATED = "validated"
    REJECTED = "rejected"


class FsecStatus(str, Enum):
    """Overall status of an FSEC."""

    DRAFT = "draft"
    IN_DESIGN = "in_design"
    IN_ASSEMBLY = "in_assembly"
    IN_METROLOGY = "in_metrology"
    IN_SEALING = "in_sealing"
    IN_PICTURES = "in_pictures"
    USABLE = "usable"
    INSTALLED = "installed"
    SHOT = "shot"
    CANCELLED = "cancelled"


class WorkflowStep(str, Enum):
    """Workflow step names (sans gaz)."""

    DESIGN = "design"
    ASSEMBLY = "assembly"
    METROLOGY = "metrology"
    SEALING = "sealing"
    PICTURES = "pictures"
    USABLE = "usable"
    INSTALLED = "installed"
    SHOT = "shot"


# Type aliases
StepName = Literal[
    "design",
    "assembly",
    "metrology",
    "sealing",
    "pictures",
    "usable",
    "installed",
    "shot",
]

StatusName = Literal[
    "draft",
    "in_design",
    "in_assembly",
    "in_metrology",
    "in_sealing",
    "in_pictures",
    "usable",
    "installed",
    "shot",
    "cancelled",
]
