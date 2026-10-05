@echo off
title AcoustiGuard AI - Frontend
echo ========================================================
echo Starting AcoustiGuard AI Frontend on Port 5173...
echo URL: http://localhost:5173
echo ========================================================
cd /d "%~dp0frontend"
call npm run dev
pause
