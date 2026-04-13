@echo off
setlocal enabledelayedexpansion

REM Set JAVA_HOME
set "JAVA_HOME=C:\Program Files\Java\jdk-25.0.2"

echo.
echo ============================================
echo   Starting Dashboard API Server
echo ============================================
echo.
echo Server URL: http://localhost:8080
echo Projects:  http://localhost:8080/api/projects
echo.
echo Press Ctrl+C to stop
echo ============================================
echo.

call mvnw.cmd spring-boot:run

pause
