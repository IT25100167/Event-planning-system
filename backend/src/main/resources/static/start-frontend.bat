@echo off
echo ===================================================
echo   Starting Event Planning System Frontend (Port 3000)
echo ===================================================
cd /d "%~dp0"
py -m http.server 3000
pause
