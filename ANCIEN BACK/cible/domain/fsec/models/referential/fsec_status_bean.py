from dataclasses import dataclass


@dataclass
class FsecStatusBean:
    id: int
    label: str = None
    color: str = None
