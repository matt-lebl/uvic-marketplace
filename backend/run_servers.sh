#!/bin/bash

# Define the directories and their respective virtual environments
declare -A servers
servers=(
  ["reverse-proxy"]=".venv-reverse-proxy"
  ["fastapi-backend"]=".venv-fastapi-backend"
  ["data-layer"]=".venv-data-layer"
)

# Function to open a new terminal and run the server
start_server() {
  local server_dir=$1
  local venv_dir=$2

  gnome-terminal -- bash -c "
    cd backend/$server_dir;
    source $venv_dir/bin/activate;
    pip install -r requirements.txt;
    python ./app/main.py;
    exec bash"
}

# Navigate to the backend directory
cd backend

# Loop through each server and start it in a new terminal
for server in "${!servers[@]}"; do
  start_server $server ${servers[$server]}
done