class ConflictException(Exception):
    def __init__(self, type: str, value: str):
        self.type = type
        self.value = value
        super().__init__(f"La {value} existe déjà pour les paramètres {type}.")
