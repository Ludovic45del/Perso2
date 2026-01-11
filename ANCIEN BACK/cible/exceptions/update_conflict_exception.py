class UpdateConflictException(Exception):
    def __init__(self, type: str, value: str):
        self.type = type
        self.value = value
        super().__init__(
            f"L'objet {value} n'existe pas dans les {type} et ne peux être mis à jour."
        )
