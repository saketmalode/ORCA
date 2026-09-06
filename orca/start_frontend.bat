@echo off
echo ============================================================
echo Starting ORCA Frontend (Vite + React - Port 5173)
echo Marine Digital Twin Command Center
echo ============================================================
set PATH=C:\Program Files\nodejs;C:\Users\saket\AppData\Local\Programs\Python\Python312;C:\Users\saket\AppData\Local\Programs\Python\Python312\Scripts;%PATH%
cd frontend
cmd.exe /c "npm run dev"
pause
