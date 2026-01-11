from dataclasses import dataclass


@dataclass
class MetrologyMachineBean:
    id: int
    label: str = None
    color: str = None
