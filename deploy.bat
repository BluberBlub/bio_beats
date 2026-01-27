@echo off
echo Starting deployment to BIO BEATS production...
"C:\Program Files (x86)\WinSCP\WinSCP.com" /log="winscp.log" /ini=nul /script="scripts\deploy.txt"
if %ERRORLEVEL% neq 0 (
  echoDeployment failed!
  exit /b %ERRORLEVEL%
)
echo Deployment successful!
