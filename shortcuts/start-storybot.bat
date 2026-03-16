@echo off
setlocal
cd /d %~dp0\..
call npm run setup
call npm run desktop
endlocal
