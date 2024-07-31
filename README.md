# UVic Marketplace

## Local Environment setup

1. **Set line endings to LF for 3 shell scripts:**

- `~/postgres-init.sh`
- `algorithms/fastapi/entrypoint.sh`
- `algorithms/kafka/entrypoint.sh`
  <br>
  > These line endings can be changed easily using vs code. Select the file, then look for `CLF` or `LF` on the bottom right of the IDE and select `LF` then save.

2. **Change VALIDATION_EMAIL_PASSWORD (contact for password).**

   > `~/backend/fastapi-backend/app/services/auth.py` **line 17**.

3. **Change baseUrl to `http://localhost:8000`.**

   > `~/frontend/src/APIlink.tsx` **line 3**.

4. **Build and run all containers with `make all`.**
   > Access front end at http://localhost:8080/.

> If any docker containers are exiting try deleting `~/postgres_data` folder and runing `make all`. If the containers are still failing try runing `make clean-all` delete the postgres_data folder again and run `make all`. If the errors continue keep trying the above steps.
