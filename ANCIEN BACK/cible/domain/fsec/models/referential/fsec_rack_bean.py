from dataclasses import dataclass


@dataclass
class FsecRackBean:
    id: int
    isFull: bool
    label: str = None
    color: str = None
