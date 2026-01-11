import pandas as pd
from sqlalchemy import create_engine

from backend import settings


def get_conn():
    return create_engine(f"sqlite:///{settings.DATABASES['default']['NAME']}").connect()


def insert_csv_into_table(self, table_name, csv_path):
    try:
        df = pd.read_csv(csv_path, dtype="string")
        df.to_sql(table_name, if_exists="append", index=False, con=get_conn())
        self.stdout.write(
            self.style.SUCCESS(
                f"Successfully inserted {csv_path} in {table_name} table"
            )
        )
    except Exception as e:
        self.stderr.write(
            self.style.ERROR(
                f"Unexpected error during insertion into table '{table_name}' => {e}"
            )
        )
