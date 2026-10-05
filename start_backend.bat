@echo off
title AcoustiGuard AI - Backend
echo ========================================================
echo Starting AcoustiGuard AI Backend Server on Port 8000...
echo API Docs: http://localhost:8000/docs
echo ========================================================
cd /d "%~dp0"
set PYTHONPATH=backend
.\venv\Scripts\python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
pause
