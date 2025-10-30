@echo off
echo Starting Astronomy Picture of the Day Web App Server...
echo.
echo This will start a local web server for testing your app.
echo Once started, open your browser and go to: http://localhost:8080
echo.
echo Press Ctrl+C to stop the server when done.
echo.
pause

powershell -ExecutionPolicy Bypass -File "start-server.ps1"
pause