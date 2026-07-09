@echo off
chcp 65001 >nul
cd /d "f:\0cxy2026\menu-app"

echo [1/4] Bumping versionCode...
call node bump-versioncode.cjs
if errorlevel 1 goto ERR

echo.
echo [2/4] Building dist...
call npm run build
if errorlevel 1 goto ERR

echo.
echo [3/4] Syncing Android...
call npx cap sync android
if errorlevel 1 goto ERR

echo.
echo [4/4] Building APK (this takes 5-10 minutes)...
cd android
call gradlew.bat assembleDebug
if errorlevel 1 (cd .. & goto ERR)
cd ..

echo.
if not exist "android\app\build\outputs\apk\debug\app-debug.apk" (
    echo [X] APK not found
    goto ERR
)
copy /Y "android\app\build\outputs\apk\debug\app-debug.apk" "面包餐厅.apk" >nul

echo.
echo =============================================
echo    [DONE] APK built successfully!
echo    File: %CD%\面包餐厅.apk
echo    (will auto-replace old version on phone install)
echo =============================================
goto END

:ERR
echo.
echo [X] Build failed!

:END
pause
