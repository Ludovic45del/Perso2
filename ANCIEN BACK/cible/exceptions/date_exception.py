from django.db import Error


class DateError(Error):
    pass


class DateException(Exception):
    def __init__(self, type: str, value: str):
        self.type = type
        self.value = value
        super().__init__(f"Value [{value} invalid date range {type}]")
