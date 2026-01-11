from django.core.exceptions import ValidationError
from django.db import models

from cible.repository.fsec.models.fsec import FsecEntity

# A UTILISER PLUS TARD LORS DE L'IMPLEMENTATION DES WORKFLOWS


class GasHighPressureWorkflowEntity(models.Model):

    class Meta:
        app_label = "cible"
        db_table = "GAS_HIGH_PRESSURE_WORKFLOW"
        verbose_name_plural = "gas_high_pressure_workflows"

    DESIGN_STATE = "design"
    ASSEMBLY_STATE = "assembly"
    METROLOGY_STATE = "metrology"
    SEALING_STATE = "sealing"
    PICTURE_STATE = "pictures"
    USABLE_STATE = "usable"
    INSTALLED_STATE = "installed"
    SHOT_STATE = "shot"
    CANCELLED_STATE = "HS"
    GAS_FILLING_HIGH_PRESSURE_STATE = "gas_filling_low_pressure"

    STATE_CHOICES = [
        (DESIGN_STATE, "Design"),
        (ASSEMBLY_STATE, "Assemblage"),
        (METROLOGY_STATE, "Métrologie"),
        (SEALING_STATE, "Scellement"),
        (PICTURE_STATE, "Photos"),
        (GAS_FILLING_HIGH_PRESSURE_STATE, "Remplissage HP"),
        (USABLE_STATE, "Utilisable"),
        (INSTALLED_STATE, "Installé"),
        (SHOT_STATE, "Tirée"),
        (CANCELLED_STATE, "HS"),
    ]

    state = models.CharField(max_length=30, choices=STATE_CHOICES, default=DESIGN_STATE)
    fsec_uuid = models.ForeignKey(FsecEntity, on_delete=models.CASCADE)

    def _check_transition(self, new_state):
        valid_transitions = {
            self.DESIGN_STATE: [self.ASSEMBLY_STATE, self.CANCELLED_STATE],
            self.ASSEMBLY_STATE: [
                self.METROLOGY_STATE,
                self.ASSEMBLY_STATE,
                self.CANCELLED_STATE,
                self.METROLOGY_STATE,
            ],
            self.METROLOGY_STATE: [
                self.SEALING_STATE,
                self.ASSEMBLY_STATE,
                self.CANCELLED_STATE,
                self.METROLOGY_STATE,
            ],
            self.SEALING_STATE: [
                self.PICTURE_STATE,
                self.ASSEMBLY_STATE,
                self.CANCELLED_STATE,
                self.METROLOGY_STATE,
            ],
            self.PICTURE_STATE: [
                self.GAS_FILLING_HIGH_PRESSURE_STATE,
                self.ASSEMBLY_STATE,
                self.CANCELLED_STATE,
                self.METROLOGY_STATE,
            ],
            self.GAS_FILLING_HIGH_PRESSURE_STATE: [
                self.USABLE_STATE,
                self.ASSEMBLY_STATE,
                self.CANCELLED_STATE,
                self.METROLOGY_STATE,
            ],
            self.USABLE_STATE: [
                self.INSTALLED_STATE,
                self.ASSEMBLY_STATE,
                self.CANCELLED_STATE,
                self.METROLOGY_STATE,
            ],
            self.INSTALLED_STATE: [
                self.SHOT_STATE,
                self.ASSEMBLY_STATE,
                self.CANCELLED_STATE,
                self.METROLOGY_STATE,
            ],
            self.SHOT_STATE: [],
            self.CANCELLED_STATE: [],
        }
        if new_state not in valid_transitions[self.state]:
            raise ValidationError(
                f"Invalid transition from {self.state} to {new_state}"
            )

    def set_state(self, new_state):
        self._check_transition(new_state)
        self.state = new_state
        self.save()

    def gas_filling_high_pressure(self):
        self.set_state(self.GAS_FILLING_HIGH_PRESSURE_STATE)

    def design(self):
        self.set_state(self.DESIGN_STATE)

    def assembly(self):
        self.set_state(self.ASSEMBLY_STATE)

    def metrology(self):
        self.set_state(self.METROLOGY_STATE)

    def sealing(self):
        self.set_state(self.SEALING_STATE)

    def pictures(self):
        self.set_state(self.PICTURE_STATE)

    def usable(self):
        self.set_state(self.USABLE_STATE)

    def installed(self):
        self.set_state(self.INSTALLED_STATE)

    def shot(self):
        self.set_state(self.SHOT_STATE)

    def cancel(self):
        self.set_state(self.CANCELLED_STATE)
