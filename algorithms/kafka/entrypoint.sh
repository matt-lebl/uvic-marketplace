#!/bin/sh

alembic -c ./db/alembic.ini upgrade head && python -u ./kafka_consumer.py
