@echo off
chcp 65001 >nul
cd /d "%~dp0"

setlocal enabledelayedexpansion

:MENU
cls
echo =============================================
echo    面包の餐厅 - 一键打包上传脚本
echo =============================================
echo.
echo   [1] 打包 APK（安卓 debug）
echo   [2] 生成 dist（iPhone PWA 部署用）
echo   [3] 上传 GitHub
echo   [4] 一键全做  = 1 + 2 + 3
echo   [0] 退出
echo.
echo =============================================
set /p choice=请选择 [0-4]:

if "%choice%"=="1" goto DO_APK
if "%choice%"=="2" goto DO_DIST
if "%choice%"=="3" goto DO_GIT
if "%choice%"=="4" goto DO_ALL
if "%choice%"=="0" goto END
echo 无效选择，请重新输入
timeout /t 2 >nul
goto MENU

:DO_APK
cls
echo =============================================
echo    步骤 1/4: 打包 APK（安卓）
echo =============================================
echo.
echo [1/4] 正在构建 dist...
call :run_step npm run build
if errorlevel 1 goto ERR

echo [2/4] 正在同步到 Android 工程...
call :run_step npx cap sync android
if errorlevel 1 goto ERR

echo [3/4] 正在编译 APK (gradle assembleDebug)...
cd android
call :run_step gradlew.bat assembleDebug
if errorlevel 1 goto ERR_CD
cd ..
echo.

echo [4/4] 正在拷贝 APK 到根目录...
set APK_SRC=android\app\build\outputs\apk\debug\app-debug.apk
set APK_DST=面包の餐厅.apk
if not exist "%APK_SRC%" (
    echo ❌ 找不到 APK 文件: %APK_SRC%
    goto ERR
)
copy /Y "%APK_SRC%" "%APK_DST%" >nul
if errorlevel 1 goto ERR

echo.
echo ✅ APK 打包完成！
echo    文件路径: %CD%\%APK_DST%
echo.
echo 💡 可用 ADB 安装到手机: adb install "%APK_DST%"
goto END

:DO_DIST
cls
echo =============================================
echo    步骤 2: 生成 dist（iPhone PWA）
echo =============================================
echo.
echo 正在构建 dist...
call :run_step npm run build
if errorlevel 1 goto ERR

if not exist "dist" (
    echo ❌ dist 目录未生成
    goto ERR
)

echo.
echo ✅ dist 已生成: %CD%\dist
echo.
echo 📤 部署到 iPhone / PWA:
echo    1. 把整个 dist 文件夹压缩成 zip
echo    2. 登录 https://dash.cloudflare.com/
echo    3. Workers 和 Pages ^> Create ^> Pages ^> Upload assets
echo    4. 把 zip 拖进去，等待部署完成
echo    5. iPhone Safari 打开链接 ^> 分享 ^> 添加到主屏幕
echo.
echo 🔧 提示: dist 目录已就绪，可直接拖拽到 Cloudflare Pages
goto END

:DO_GIT
cls
echo =============================================
echo    步骤 3: 上传 GitHub
echo =============================================
echo.
set /p msg=请输入提交说明（直接回车 = update）:
if "%msg%"=="" set msg=update

echo 正在检查 git 状态...
git status --short >nul 2>&1
if errorlevel 1 (
    echo ❌ git 不可用，请先安装 Git
    goto ERR
)

echo 正在添加所有文件...
git add .
if errorlevel 1 goto ERR

echo 正在提交...
git commit -m "%msg%"
if errorlevel 1 goto ERR

echo 正在推送到 origin main...
git push origin main
if errorlevel 1 goto ERR

echo.
echo ✅ GitHub 上传完成！
echo    https://github.com/caoxueyang/--breadCook
goto END

:DO_ALL
cls
echo =============================================
echo    一键全做: dist + APK + GitHub
echo =============================================
echo.

echo [1/4] 构建 dist...
call :run_step npm run build
if errorlevel 1 goto ERR

echo [2/4] 打包 APK...
call :run_step npx cap sync android
if errorlevel 1 goto ERR
cd android
call :run_step gradlew.bat assembleDebug
if errorlevel 1 goto ERR_CD
cd ..

set APK_SRC=android\app\build\outputs\apk\debug\app-debug.apk
set APK_DST=面包の餐厅.apk
if not exist "%APK_SRC%" (
    echo ❌ 找不到 APK 文件
    goto ERR
)
copy /Y "%APK_SRC%" "%APK_DST%" >nul
echo     ✓ APK 已拷贝到根目录

echo [3/4] 准备 GitHub 上传...
set /p msg=提交说明（直接回车 = update）:
if "%msg%"=="" set msg=update

git add .
if errorlevel 1 goto ERR

git commit -m "%msg%"
if errorlevel 1 goto ERR

echo [4/4] 推送到 GitHub...
git push origin main
if errorlevel 1 goto ERR

echo.
echo ✅ 全部完成！
echo    📁 dist 目录已生成 (iPhone PWA)
echo    📱 APK 已生成: %APK_DST%
echo    🌐 GitHub 已更新
goto END

:run_step
echo     执行: %*
%*
exit /b %errorlevel%

:ERR_CD
cd ..
goto ERR

:ERR
echo.
echo ❌ 出错啦！请检查上面的日志
echo.

:END
echo.
pause
endlocal
