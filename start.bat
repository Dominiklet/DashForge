@echo off

echo Building Docker Image...
docker build -t mockserver ./src/mock-server

echo.
echo Starting Mock Server...
docker run --rm -p 3000:3000 -v "%cd%\src\mock-server:/data" mockserver

pause