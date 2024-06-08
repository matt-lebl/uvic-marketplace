# Set up for fastapi servers:

- Setup virtual environment for each server
  example:
  `python -m venv ./.venv-api`

> _Optional_ You can use a single venv but keep track of individual dependencies in each server's requirements.txt

- Install dependencies: - Change current directory to the target server - Install dependencies based on target servers requirements
  `pip install -r "./requirements.txt`
- Run server in dev mode (auto reload enabled):
  `fastapi dev main.py`

### Notes

- Interactive OpenAPI docs are found at [url]/docs
  > Alternate docs at [url]/redoc
- Fast api supports async funtions. Declare with `async def`
- When you declare other function parameters that are not part of the path parameters, they are automatically interpreted as "query" parameters.
- Make query param optional by setting default value to None

- Path parameters + Query parameters + request body

  - If the parameter is also declared in the path, it will be used as a path parameter.
  - If the parameter is of a singular type (like int, float, str, bool, etc) it will be interpreted as a query parameter.
  - If the parameter is declared to be of the type of a Pydantic model, it will be interpreted as a request body.

- Included packages that are worth looking into:

  - Annotated (from typing)
  - Query, Path, Body, status, Form, HTTPException, Depends (from fastapi)
  - BaseModel, Field (from pydantic)

- Other reccomended packages:
  - pyjwt (python JWT package)
  - passlib[bcrypt] (python package for password hashing)
    > [FastAPI JWT docs](https://fastapi.tiangolo.com/tutorial/security/oauth2-jwt/)
  - pytest
  - httpx (needed to use pytest)

### Current dependencies

**reverse-proxie**

- fastapi

**api**

- fastapi

**data-layer**

- fastapi
