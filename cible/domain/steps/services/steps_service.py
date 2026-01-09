"""Services STEPS - Logique métier pure pour les étapes FSEC."""
from typing import Any, List, Optional, Protocol, TypeVar, Union

from cible.domain.exceptions import NotFoundException

# Type générique pour les beans
StepBean = TypeVar("StepBean")


class IStepRepository(Protocol[StepBean]):
    """Protocole définissant les méthodes attendues d'un repository de Step."""

    def create(self, bean: StepBean) -> StepBean:
        """Crée une nouvelle étape."""
        ...

    def get_by_uuid(self, uuid: str) -> Optional[StepBean]:
        """Récupère une étape par son UUID."""
        ...

    def get_by_fsec_version_id(
        self, fsec_version_id: str
    ) -> Union[List[StepBean], Optional[StepBean]]:
        """Récupère les étapes d'un FSEC."""
        ...

    def update(self, bean: StepBean) -> StepBean:
        """Met à jour une étape."""
        ...

    def delete(self, uuid: str) -> bool:
        """Supprime une étape."""
        ...


def create_step(repository: IStepRepository[StepBean], bean: StepBean) -> StepBean:
    """Crée une nouvelle étape."""
    return repository.create(bean)


def get_step_by_uuid(
    repository: IStepRepository[StepBean], uuid: str, step_name: str
) -> StepBean:
    """Récupère une étape par son UUID."""
    bean = repository.get_by_uuid(uuid)
    if bean is None:
        raise NotFoundException(step_name, uuid)
    return bean


def get_steps_by_fsec_version_id(
    repository: IStepRepository[StepBean], fsec_version_id: str
) -> Union[List[StepBean], Optional[StepBean]]:
    """Récupère les étapes d'un FSEC."""
    return repository.get_by_fsec_version_id(fsec_version_id)


def update_step(
    repository: IStepRepository[StepBean], bean: StepBean, step_name: str
) -> StepBean:
    """Met à jour une étape."""
    existing = repository.get_by_uuid(bean.uuid)  # type: ignore
    if existing is None:
        raise NotFoundException(step_name, str(getattr(bean, "uuid", "")))
    return repository.update(bean)


def delete_step(
    repository: IStepRepository[StepBean], uuid: str, step_name: str
) -> bool:
    """Supprime une étape."""
    if not repository.delete(uuid):
        raise NotFoundException(step_name, uuid)
    return True
