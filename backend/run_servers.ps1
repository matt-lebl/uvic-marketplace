# Works for me using powershell *not windows powershell, you can download
# powershell in the microsoft store or replace pwsh with powershell

# Define the directories and their respective virtual environments
$servers = @{
    "reverse-proxy" = ".venv-reverse-proxy"
    "fastapi-backend" = ".venv-fastapi-backend"
    "data-layer" = ".venv-data-layer"
}

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

# Loop through each server and start it in a new PowerShell window
foreach ($server in $servers.Keys) {
    Start-Server -serverDir $server -venvDir $servers[$server]
}