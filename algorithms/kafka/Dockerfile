FROM python:3.8-slim

# Set the working directory in the container
WORKDIR /code

RUN --mount=type=cache,target=/root/.cache/pip \
    --mount=type=bind,source=kafka/requirements.txt,target=requirements.txt \
    python -m pip install -r requirements.txt


# Copy the current directory contents into the container at /code
COPY ./kafka .
COPY ./db ./db
COPY ./util ./util

ENV PYTHONPATH=/code

# Run the application
# -u flag is used to force the stdout to be unbuffered, fixes the issue of logs not being printed
CMD ["python","-u", "kafka_consumer.py"]
