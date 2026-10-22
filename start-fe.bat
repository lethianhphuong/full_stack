@echo off
chcp 65001 >nul
title MAU Material - Frontend (React Vite)

echo ======================================================================
echo           MAU MATERIAL - KHOI DONG FRONTEND (REACT VITE)
echo ======================================================================
echo.
echo Giao dien:     http://localhost:5173
echo.
echo Nhan Ctrl + C de dung server.
echo ======================================================================
echo.

cd /d "%~dp0FE_material"
npm run dev
pause
