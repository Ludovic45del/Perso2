class StockCreationException(Exception):
    def __init__(self, ligne: str, value: str):
        self.ligne = ligne
        self.value = value
        super().__init__(f"La ligne {ligne} des {value} n'a pas pu être importée.")
