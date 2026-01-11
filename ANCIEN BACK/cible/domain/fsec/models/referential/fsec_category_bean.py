from dataclasses import dataclass


@dataclass
class FsecCategoryBean:
    id: int
    label: str = None
    color: str = None
