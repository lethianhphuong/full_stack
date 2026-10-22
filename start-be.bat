@echo off
chcp 65001 >nul
title MAU Material - Backend (Spring Boot)

echo ======================================================================
echo           MAU MATERIAL - KHOI DONG BACKEND (SPRING BOOT)
echo ======================================================================
echo.
echo Server:        http://localhost:8080
echo Swagger UI:    http://localhost:8080/swagger-ui.html
echo.
echo Nhan Ctrl + C de dung server.
echo ======================================================================
echo.

cd /d "%~dp0BE_material"
mvn spring-boot:run
pause
