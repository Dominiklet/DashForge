@echo off

echo Stoppe alten Mockserver...
for /f %%i in ('docker ps -q --filter "publish=3000"') do (
    docker stop %%i
)

echo Building Docker Image...
docker build -t mockserver ./src/mock-server

echo.
echo Starting Mock Server...
start cmd /k docker run --name mockserver-container --rm -p 3000:3000 -v "%cd%\src\mock-server:/data" mockserver

echo Starting Vite Frontend...
start "Vite" cmd /k "npm run dev"

pause