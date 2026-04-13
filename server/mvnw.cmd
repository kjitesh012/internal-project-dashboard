@REM Apache Maven Wrapper
setlocal

set "JAVA_HOME=C:\Program Files\Java\jdk-25.0.2"

%JAVA_HOME%\bin\java.exe ^
  -classpath "%~dp0.mvn\wrapper\maven-wrapper.jar" ^
  "-Dmaven.multiModuleProjectDirectory=%~dp0" ^
  org.apache.maven.wrapper.MavenWrapperMain %*

endlocal
