@echo off
REM Set PATH to use Node 24 first (Vite 5 needs Node 18+)
set "PATH=C:\Program Files\nodejs;%PATH%"
node %*
