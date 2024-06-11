# Backend Services
This file contains the details for the usage of the backend services.  
Specifically:
- data_layer: The service in charge of all database interactions
- db: The service that contains the database
- reverse_proxy: The service in charge of routing all incoming traffic.
- fast_api_backend: The service in charge of handling all backend specific requests.
  
  
## DB
Usage: Need to have a .env file in the backend/services directory with the following format.  
POSTGRES_USER=my_username  
POSTGRES_PASSWORD=my_password  
POSTGRES_DB=my_database  
DB_HOST=localhost  
PGDATA=/var/lib/postgresql/data  

This will spin up a local docker instance of the psql server. From there
you can connect to it as shown in the data_layer/test_db.py file

