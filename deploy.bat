@echo off
echo Starting deployment to BIO BEATS production...
"C:\Users\endre\AppData\Local\Programs\WinSCP\WinSCP.com" /log="winscp.log" /ini=nul /script="scripts\deploy_final.txt"
if %ERRORLEVEL% neq 0 (
  echo Deployment failed!
  exit /b %ERRORLEVEL%
)
echo Deployment successful!
