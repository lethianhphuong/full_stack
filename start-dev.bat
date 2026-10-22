@echo off
chcp 65001 >nul
title MAU Material - Development Launcher

echo ======================================================================
echo           MAU MATERIAL - KHOI DONG HE THONG FULLSTACK
echo ======================================================================
echo.

echo [1/2] Dang khoi dong Backend Spring Boot (Port 8080)...
start "MAU Material - Backend (Spring Boot)" cmd /k "cd /d %~dp0BE_material && mvn spring-boot:run"

echo [2/2] Dang khoi dong Frontend React Vite (Port 5173)...
start "MAU Material - Frontend (Vite)" cmd /k "cd /d %~dp0FE_material && npm run dev"

echo.
echo ======================================================================
echo  Da mo 2 cua so chay song song:
echo   - Backend:   http://localhost:8080
echo     Swagger:   http://localhost:8080/swagger-ui.html
echo   - Frontend:  http://localhost:5173
echo ======================================================================
echo.
echo Cua so nay se tu dong dong sau 5 giay...
timeout /t 5 >nul
