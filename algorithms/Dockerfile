FROM python:3.8-slim

# Set the working directory in the container
WORKDIR /code

# Copy the current directory contents into the container at /code
COPY ./app /code/app
COPY requirements.txt /code/

# Install system dependencies
RUN apt-get update && \
    apt-get install -y build-essential curl dos2unix libpq-dev && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Ensure line endings are correct (if necessary)
RUN find /code -type f -exec dos2unix {} \;

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Run the application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "80"]
