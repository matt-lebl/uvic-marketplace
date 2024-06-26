#!/bin/bash

# Function to create a virtual environment if it doesn't exist
ensure_venv() {
    local server_dir=$1
    local venv_dir=$2

    if [ ! -d "$server_dir/$venv_dir" ]; then
        echo "Creating virtual environment for $server_dir..."
        cd $server_dir
        python3 -m venv $venv_dir
        cd ..
    else
        echo "Virtual environment for $server_dir already exists."
    fi
}

# Define the directories and their respective virtual environments
declare -A servers=(
    ["reverse-proxy"]=".venv-reverse-proxy"
    ["fastapi-backend"]=".venv-fastapi-backend"
    ["data-layer"]=".venv-data-layer"
)

# Create virtual environments if they don't exist
for server in "${!servers[@]}"; do
    ensure_venv $server ${servers[$server]}
done

echo "Virtual environment setup complete."

# Function to start the server in a new terminal
start_server() {
    local server_dir=$1
    local venv_dir=$2

    gnome-terminal -- bash -c "
        cd $server_dir
        source ./$venv_dir/bin/activate
        pip install -r requirements.txt
        python ./app/main.py
        exec bash
    "
}

# Start Docker Desktop if it's not already running
if ! pgrep -x "dockerd" > /dev/null; then
    echo "Starting Docker..."
    sudo systemctl start docker
    sleep 10 # Adjust the sleep duration as needed
fi

# Start Docker containers
gnome-terminal -- bash -c "
    cd db
    docker-compose up
    exec bash
"

# Loop through each server and start it in a new terminal
for server in "${!servers[@]}"; do
    start_server $server ${servers[$server]}
done

# Open Google Chrome tabs for the API docs
google-chrome "http://localhost:8000/docs" "http://localhost:8001/docs" "http://localhost:8002/docs"
