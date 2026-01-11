import pandas as pd
from sqlalchemy import create_engine
from django.conf import settings


def get_conn():
    # Convert Path to string for connection string
    db_path = str(settings.DATABASES['default']['NAME'])
    return create_engine(f"sqlite:///{db_path}").connect()


def insert_csv_into_table(self, table_name, csv_path):
    try:
        df = pd.read_csv(csv_path, dtype="string")
        # Ensure we use an active connection from the engine
        with get_conn() as connection:
            df.to_sql(table_name, if_exists="append", index=False, con=connection)
        
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
