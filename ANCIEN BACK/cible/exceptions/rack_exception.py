class RackException(Exception):
    def __init__(self, rack_label: str):
        self.rack_label = rack_label
        super().__init__(f"Le rack {self.rack_label} est complet")
