FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt /app/

COPY ./app /app
COPY ./sql_models.py /app/routers

RUN apt-get update && apt-get install -y libpq-dev gcc
RUN pip install --no-cache-dir -r ./requirements.txt

EXPOSE 80
WORKDIR ../
CMD ["fastapi", "dev", "app/main.py"]


