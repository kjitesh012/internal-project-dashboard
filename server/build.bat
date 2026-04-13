@echo off
setlocal enabledelayedexpansion

REM Set JAVA_HOME
set "JAVA_HOME=C:\Program Files\Java\jdk-25.0.2"

REM Verify Java installation
if not exist "!JAVA_HOME!\bin\java.exe" (
    echo Error: Java not found at !JAVA_HOME!
    echo Please install Java 17 or later
    exit /b 1
)

echo Building Spring Boot API Server...
echo.

REM Run Maven build
call mvnw.cmd clean package -DskipTests

if %ERRORLEVEL% equ 0 (
    echo.
    echo Build successful!
    echo.
    echo To run the server, execute:
    echo   run-server.bat
    echo Or:
    echo   java -jar target/api-server-1.0.0.jar
) else (
    echo Build failed
    exit /b %ERRORLEVEL%
)
