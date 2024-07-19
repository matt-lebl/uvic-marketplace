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

# Make the entrypoint script executable
RUN chmod 755 ./entrypoint.sh

# Run the application.
CMD ./entrypoint.sh