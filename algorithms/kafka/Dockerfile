FROM python:3.8-slim

# Set the working directory in the container
WORKDIR /code

RUN --mount=type=cache,target=/root/.cache/pip \
    --mount=type=bind,source=requirements.txt,target=requirements.txt \
    python -m pip install -r requirements.txt


# Copy the current directory contents into the container at /code
COPY app /code/app
COPY consumers /code/consumers
COPY kafka_consumer.py /code/kafka_consumer.py
COPY entrypoint.sh /code/

ENV PYTHONPATH=/code

# Run the application
CMD ["python", "kafka_consumer.py"]
