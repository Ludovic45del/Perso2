from dataclasses import dataclass
from typing import Optional

from cible.domain.fsec.models.referential.fsec_role_bean import FsecRoleBean


@dataclass
class FsecTeamBean:
    name: str
    role: FsecRoleBean
    fsecVersionUuid: Optional[str] = None
    uuid: str = None
