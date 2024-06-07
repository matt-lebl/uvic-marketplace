# Settup for fastapi servers:

- Setup virtual environment for each server
  example:
  `python -m venv ./.venv-api`
  > _Optional_ You can use a single venv but keep track of individual dependencies in each server's requirements.txt
- Install dependencies: - Change current directory to the target server - Install dependencies based on target servers requirements
  `pip install -r "./requirements.txt`
- Run server in dev mode (auto reload enabled):
  `fastapi dev main.py`
