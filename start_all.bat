@echo off
title AcoustiGuard AI Launcher
echo ========================================================
echo Launching AcoustiGuard AI Platform (Backend + Frontend)
echo ========================================================
start "AcoustiGuard AI - Backend" cmd /k "cd /d %~dp0 && set PYTHONPATH=backend && .\venv\Scripts\python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"
start "AcoustiGuard AI - Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"
echo.
echo Both servers have been launched in separate terminal windows.
echo - Frontend: http://localhost:5173
echo - Backend API Docs: http://localhost:8000/docs
echo.
pause
