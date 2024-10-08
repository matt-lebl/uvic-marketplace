# Function to check if Docker is running and start it if not
function Start-Docker {
    $dockerProcess = Get-Process -Name "Docker Desktop" -ErrorAction SilentlyContinue
    if ($null -eq $dockerProcess) {
        Write-Output "Starting Docker Desktop..."
        Start-Process "C:\Program Files\Docker\Docker Desktop.exe"
        Start-Sleep -Seconds 10 # Adjust the sleep duration as needed
    }
}

# Function to create a virtual environment if it doesn't exist
function Ensure-Venv {
    param (
        [string]$serverDir,
        [string]$venvDir
    )
    
    if (-Not (Test-Path "$serverDir/$venvDir")) {
        Write-Output "Creating virtual environment for $serverDir..."
        cd $serverDir
        python -m venv $venvDir
        cd ..
    } else {
        Write-Output "Virtual environment for $serverDir already exists."
    }
}

# Define the directories and their respective virtual environments
$servers = @{
    "reverse-proxy" = ".venv-reverse-proxy"
    "fastapi-backend" = ".venv-fastapi-backend"
    "data-layer" = ".venv-data-layer"
}

# Create virtual environments if they don't exist
foreach ($server in $servers.Keys) {
    Ensure-Venv -serverDir $server -venvDir $servers[$server]
}

Write-Output "Virtual environment setup complete."

# Function to open a new PowerShell window and run the server
function Start-Server {
    param (
        [string]$serverDir,
        [string]$venvDir
    )

    Start-Process pwsh -ArgumentList "-NoExit", "-Command", "
        cd $serverDir;
        ./$venvDir/Scripts/Activate;
        pip install -r requirements.txt;
        python ./app/main.py
    "
}

# Start Docker Desktop if it's not already running
Start-Docker

# Start a new PowerShell window for Docker
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "
    cd db;
    docker-compose up
"

# Loop through each server and start it in a new PowerShell window
foreach ($server in $servers.Keys) {
    Start-Server -serverDir $server -venvDir $servers[$server]
}

# Open Google Chrome tabs for the API docs
Start-Process "chrome.exe" "http://localhost:8000/docs"
Start-Process "chrome.exe" "http://localhost:8001/docs"
Start-Process "chrome.exe" "http://localhost:8002/docs"