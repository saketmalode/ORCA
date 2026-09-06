@echo off
echo ============================================================
echo LAUNCHING ORCA MARINE INTELLIGENCE PLATFORM (SIH26176)
echo Department of Space / ISRO
echo Strict Zero-LLM Architecture
echo ============================================================
start "ORCA Backend (FastAPI)" cmd.exe /k "start_backend.bat"
timeout /t 3 /nobreak >nul
start "ORCA Frontend (Vite)" cmd.exe /k "start_frontend.bat"
echo.
echo Launching browser to http://localhost:5173 ...
timeout /t 4 /nobreak >nul
start http://localhost:5173
