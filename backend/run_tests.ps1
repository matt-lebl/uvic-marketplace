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
        cd ./tests;
        pytest;
    "
}

# Install requirements for each server
foreach ($server in $servers.Keys) {
    Start-Server -serverDir $server -venvDir $servers[$server]
}
