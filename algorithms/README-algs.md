# Company 1 Algorithms

The directory structure is as follows:

- **/app:** the code for our services:
- **/app/api:** the code for our API endpoints
- **/app/kafka:** the code for our Kafka listeners
- **/app/db:** the code for Postgres initialization
- **/app/util:** code shared by multiple services
- **/test:** tests for our services

Run the service using `docker compose up`. 

## Testing
To run tests only, run `docker compose up tests`. To test the search endpoint vigorously, ensure the FastAPI service is runing and run (on the host) `python tests/search_testing_script.py`.
