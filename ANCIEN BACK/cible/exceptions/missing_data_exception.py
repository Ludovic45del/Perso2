class MissingDataException(Exception):
    def __init__(self, field_name: str):
        super().__init__(
            f"Le champ {field_name} est obligatoire et ne peut pas être vide."
        )
