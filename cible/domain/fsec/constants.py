"""
Constants for FSEC domain.

This module defines all workflow steps, statuses, and validation rules
for FSEC (Faisceau de Sécurité) management.
"""

from typing import List, Dict

# ==============================================================================
# WORKFLOW SANS GAZ (Gasless Workflow)
# ==============================================================================

WORKFLOW_SANS_GAZ: List[str] = [
    "design",
    "assembly",
    "metrology",
    "sealing",
    "pictures",
    "usable",
    "installed",
    "shot",
]

# Step display names
STEP_LABELS: Dict[str, str] = {
    "design": "Design",
    "assembly": "Assembly",
    "metrology": "Metrology",
    "sealing": "Sealing",
    "pictures": "Pictures",
    "usable": "Usable",
    "installed": "Installed",
    "shot": "Shot",
}

# ==============================================================================
# REQUIRED ROLES BY STEP
# ==============================================================================

REQUIRED_ROLES: Dict[str, List[str]] = {
    "design": ["concepteur", "verificateur"],
    "assembly": ["assembleur", "controleur_qualite"],
    "metrology": ["metrologue"],
    "sealing": ["operateur_etancheite", "controleur_qualite"],
    "pictures": ["photographe"],
    "usable": ["responsable_qualite"],
    "installed": ["installateur", "verificateur"],
    "shot": ["operateur_tir", "responsable_securite"],
}

# ==============================================================================
# REQUIRED DOCUMENT SUBTYPES BY STEP
# ==============================================================================

REQUIRED_SUBTYPES_DOCS: Dict[str, List[str]] = {
    "design": [
        "plan_conception",
        "note_calcul",
        "specification_technique",
    ],
    "assembly": [
        "fiche_montage",
        "pv_controle_visuel",
    ],
    "metrology": [
        "rapport_metrologie",
        "certificat_conformite",
    ],
    "sealing": [
        "pv_test_etancheite",
    ],
    "pictures": [
        "photo_face_avant",
        "photo_face_arriere",
        "photo_connectique",
    ],
    "usable": [
        "certificat_utilisabilite",
    ],
    "installed": [
        "pv_installation",
        "schema_connexion",
    ],
    "shot": [
        "rapport_tir",
        "donnees_acquisition",
    ],
}

# ==============================================================================
# STEP STATUS
# ==============================================================================

STEP_STATUS_PENDING = "pending"
STEP_STATUS_IN_PROGRESS = "in_progress"
STEP_STATUS_COMPLETED = "completed"
STEP_STATUS_VALIDATED = "validated"
STEP_STATUS_REJECTED = "rejected"

STEP_STATUSES: List[str] = [
    STEP_STATUS_PENDING,
    STEP_STATUS_IN_PROGRESS,
    STEP_STATUS_COMPLETED,
    STEP_STATUS_VALIDATED,
    STEP_STATUS_REJECTED,
]

# ==============================================================================
# FSEC STATUS
# ==============================================================================

FSEC_STATUS_DRAFT = "draft"
FSEC_STATUS_IN_DESIGN = "in_design"
FSEC_STATUS_IN_ASSEMBLY = "in_assembly"
FSEC_STATUS_IN_METROLOGY = "in_metrology"
FSEC_STATUS_IN_SEALING = "in_sealing"
FSEC_STATUS_IN_PICTURES = "in_pictures"
FSEC_STATUS_USABLE = "usable"
FSEC_STATUS_INSTALLED = "installed"
FSEC_STATUS_SHOT = "shot"
FSEC_STATUS_CANCELLED = "cancelled"

FSEC_STATUSES: List[str] = [
    FSEC_STATUS_DRAFT,
    FSEC_STATUS_IN_DESIGN,
    FSEC_STATUS_IN_ASSEMBLY,
    FSEC_STATUS_IN_METROLOGY,
    FSEC_STATUS_IN_SEALING,
    FSEC_STATUS_IN_PICTURES,
    FSEC_STATUS_USABLE,
    FSEC_STATUS_INSTALLED,
    FSEC_STATUS_SHOT,
    FSEC_STATUS_CANCELLED,
]
