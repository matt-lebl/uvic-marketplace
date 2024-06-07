# This script is for provisioning a database initially, should only be run once at server startup
import psycopg
from sql_scripts import SqlScripts as sql


def main():
    db_config = open("db_config.txt").read()
    with psycopg.connect(db_config) as conn:
        with conn.cursor() as cur:
            for script in sql.PROVISION_SCRIPTS:
                cur.execute(script)

        conn.commit()


if __name__ == "__main__":
    main()
