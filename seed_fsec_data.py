import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from cible.repository.fsec.models.fsec_roles_entity import FsecRolesEntity
from cible.repository.fsec.models.fsec_document_types_entity import FsecDocumentTypesEntity
from cible.repository.fsec.models.fsec_document_subtypes_entity import FsecDocumentSubtypesEntity
from cible.repository.fsec.models.fsec_status_entity import FsecStatusEntity
from cible.repository.fsec.models.fsec_category_entity import FsecCategoryEntity
from cible.repository.fsec.models.fsec_rack_entity import FsecRackEntity

def seed():
    print("Seeding FSEC Status...")
    statuses = [
        (0, "Draft"), # Assuming 0 is allowed if we force it, else use 1
        (1, "En cours"),
        (2, "Validé"),
    ]
    for status_id, label in statuses:
        obj, created = FsecStatusEntity.objects.get_or_create(id=status_id, defaults={'label': label})
        if created: print(f"Created Status: {label} (ID: {status_id})")

    print("\nSeeding FSEC Categories...")
    categories = [
        (1, "Standard"),
        (2, "Spécifique"),
    ]
    for cat_id, label in categories:
        obj, created = FsecCategoryEntity.objects.get_or_create(id=cat_id, defaults={'label': label})
        if created: print(f"Created Category: {label} (ID: {cat_id})")

    print("\nSeeding FSEC Roles...")
    roles = [
        (1, "MOE"),
        (2, "REC"),
        (3, "IEC"),
        (4, "Assembleur"),
        (5, "Métrologue"),
        (6, "Opérateur"),
    ]
    for role_id, label in roles:
        obj, created = FsecRolesEntity.objects.get_or_create(id=role_id, defaults={'label': label})
        if created:
            print(f"Created Role: {label} (ID: {role_id})")
        else:
            print(f"Role already exists: {label} (ID: {role_id})")

    print("\nSeeding FSEC Document Types...")
    types = [
        (1, "Design"),
        (2, "Assemblage"),
        (3, "Métrologie"),
        (4, "Photos"),
        (5, "Résultats"),
    ]
    for type_id, label in types:
        obj, created = FsecDocumentTypesEntity.objects.get_or_create(id=type_id, defaults={'label': label})
        if created:
            print(f"Created Type: {label} (ID: {type_id})")

    print("\nSeeding FSEC Document Subtypes...")
    # (id, type_id, label)
    subtypes = [
        # Design (Type 1)
        (1, 1, "Visrad Initial"),
        (2, 1, "Vues 3D"),
        (3, 1, "STP Métro"),
        (4, 1, "Fiches Caractéristiques"),
        (5, 1, "Fiche Réception"),
        (6, 1, "Gamme Assemblage"),
        
        # Metrologie (Type 3)
        (7, 3, "Visrad Contrôle"),
        (8, 3, "Fichier Métro"),
        (9, 3, "Écart Métro"),
        
        # Photos (Type 4)
        (10, 4, "Photo"),
    ]
    
    for subtype_id, type_id, label in subtypes:
        # We need the Type instance
        type_obj = FsecDocumentTypesEntity.objects.get(id=type_id)
        obj, created = FsecDocumentSubtypesEntity.objects.get_or_create(
            id=subtype_id, 
            defaults={'label': label, 'type_id': type_obj}
        )
        if created:
            print(f"Created Subtype: {label} (ID: {subtype_id})")

if __name__ == "__main__":
    seed()
