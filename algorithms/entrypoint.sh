#!/bin/sh

alembic -c /app/alembic.ini upgrade head && uvicorn app.main:app --host 0.0.0.0 --port 80
