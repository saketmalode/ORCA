@echo off
echo ============================================================
echo Starting ORCA Backend (FastAPI - Port 8000)
echo Strict Zero-LLM Architecture: 11 Autonomous Software Agents
echo ============================================================
set PATH=C:\Program Files\nodejs;C:\Users\saket\AppData\Local\Programs\Python\Python312;C:\Users\saket\AppData\Local\Programs\Python\Python312\Scripts;%PATH%
set PYTHONIOENCODING=utf-8
python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
pause
