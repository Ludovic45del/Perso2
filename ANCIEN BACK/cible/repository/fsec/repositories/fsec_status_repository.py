from cible.domain.fsec.interface.i_fsec_status_repositrory import IFsecStatusRepository
from cible.domain.fsec.models.referential.fsec_status_bean import FsecStatusBean
from cible.mapper.fsec.fsec_mapper import fsec_status_mapper_entity_to_bean
from cible.repository.fsec.models.referential.fsec_status import FsecStatusEntity


class FsecStatusRepository(IFsecStatusRepository):

    # Quick fix en attendant de mettre les vrais workflows
    def get_fsec_status(self, category) -> list[FsecStatusBean]:

        match category:
            case "Sans Gaz":
                list_of_ids = [0, 1, 2, 3, 4, 5, 6, 7, 8]
            case "Avec Gaz HP":
                list_of_ids = [0, 1, 2, 3, 4, 9, 5, 6, 7, 8]
            case "Avec Gaz BP":
                list_of_ids = [0, 1, 2, 3, 10, 4, 11, 5, 6, 7, 8]
            case "Avec Gaz BP + HP":
                list_of_ids = [0, 1, 2, 3, 10, 4, 11, 10, 5, 6, 7, 8]
            case "Avec Gaz Permeation + BP":
                list_of_ids = [0, 1, 2, 3, 10, 4, 12, 13, 11, 14, 5, 6, 7, 8]
            case _:
                list_of_ids = [0, 1, 2, 3, 4, 5, 6, 7, 8]

        statuses = FsecStatusEntity.objects.filter(id__in=list_of_ids)

        reordered_statuses = self.reorder_statuses_by_id(list_of_ids, statuses)

        if len(reordered_statuses) == 0:
            return []
        else:
            return list(
                map(
                    lambda x: fsec_status_mapper_entity_to_bean(x),
                    reordered_statuses,
                )
            )

    def reorder_statuses_by_id(self, list_of_ids, queryset):
        id_to_obj = {obj.id: obj for obj in queryset}
        return [id_to_obj[i] for i in list_of_ids if i in id_to_obj]
