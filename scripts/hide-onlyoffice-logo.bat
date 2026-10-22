@echo off
echo ========================================================
echo  DANG XOA LOGO ONLYOFFICE (COMPLETE MULTI-LAYER PATCH)...
echo ========================================================

set DOCKER_CMD="C:\Users\Admin\AppData\Local\Programs\DockerDesktop\resources\bin\docker.exe"
if not exist %DOCKER_CMD% (
    set DOCKER_CMD=docker
)

set SCRIPT_DIR=%~dp0
%DOCKER_CMD% cp "%SCRIPT_DIR%patch_complete.py" onlyoffice:/tmp/patch_complete.py
%DOCKER_CMD% exec onlyoffice python3 /tmp/patch_complete.py

echo ========================================================
echo  HOAN TAT! Logo da bi loai bo triet de tren tat ca template!
echo  Vui long tai lai trang (F5).
echo ========================================================
pause
