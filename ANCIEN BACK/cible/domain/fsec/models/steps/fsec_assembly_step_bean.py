from dataclasses import dataclass
from typing import Optional

from cible.domain.fsec.models.fsec_team_bean import FsecTeamBean
from cible.domain.fsec.models.referential.fsec_assembly_bench_bean import (
    FsecAssemblyBenchBean,
)
from cible.domain.fsec.models.referential.fsec_status_bean import FsecStatusBean
from cible.domain.fsec.models.steps.fsec_base_step_bean import FsecBaseStep
from cible.domain.fsec.models.steps.fsec_teams_manager import FsecTeamManager


@dataclass
class FsecAssemblyStepBean(FsecBaseStep, FsecTeamManager):
    hydrometricTemperature: float
    comments: str
    assemblyBench: list[FsecAssemblyBenchBean]
    fsecTeam: list[FsecTeamBean] = None
    startDate: Optional[str] = None
    endDate: Optional[str] = None
    REQUIRED_ROLES = {3: "ASSEMBLEUR"}

    def get_next_step(self) -> FsecStatusBean | None:
        pass

    def get_previous_step(self) -> FsecStatusBean | None:
        return None

    def is_valid(self) -> bool:
        return True
