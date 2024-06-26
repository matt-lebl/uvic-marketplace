FROM python:3.8-slim

# Set the working directory in the container
WORKDIR /code

# Install any needed packages specified in requirements.txt
COPY requirements.txt /code/
RUN pip install --no-cache-dir -r requirements.txt

# Copy the current directory contents into the container at /code
COPY app /code/app
COPY alembic.ini /code/
COPY alembic /code/alembic

ENV PYTHONPATH=/code

# Run the application
CMD ["uvicorn", "app.api.main:app", "--host", "0.0.0.0", "--port", "80"]
