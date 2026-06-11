@echo off
chcp 65001 >nul
cd /d "%~dp0"

:MENU
cls
echo =============================================
echo    面包の餐厅 - 一键打包脚本
echo =============================================
echo.
echo   [1] 打包 APK (Android debug)
echo   [2] 生成 dist (iPhone PWA)
echo   [3] 上传 GitHub
echo   [4] 一键全做 1+2+3
echo   [0] 退出
echo.
echo =============================================
set /p choice=请选择 [0-4]:

if "%choice%"=="1" goto DO_APK
if "%choice%"=="2" goto DO_DIST
if "%choice%"=="3" goto DO_GIT
if "%choice%"=="4" goto DO_ALL
if "%choice%"=="0" goto END
echo 无效输入
timeout /t 2 >nul
goto MENU

:DO_APK
cls
echo =============================================
echo    [1] 打包 APK
echo =============================================
echo.

echo [1/4] 构建 dist...
call npm run build || goto ERR

echo [2/4] 同步 Android...
call npx cap sync android || goto ERR

echo [3/4] 编译 APK (耗时较长, 请耐心等待)...
cd android
call gradlew.bat assembleDebug || (cd .. & goto ERR)
cd ..

echo [4/4] 拷贝 APK 到根目录...
if not exist "android\app\build\outputs\apk\debug\app-debug.apk" (
    echo [X] 找不到 APK 文件
    goto ERR
)
copy /Y "android\app\build\outputs\apk\debug\app-debug.apk" "面包餐厅.apk" >nul

echo.
echo =============================================
echo    [完成] APK 打包成功
echo    文件: %CD%\面包餐厅.apk
echo    安装: adb install 面包餐厅.apk
echo =============================================
goto END

:DO_DIST
cls
echo =============================================
echo    [2] 生成 dist
echo =============================================
echo.

call npm run build || goto ERR

if not exist "dist" (
    echo [X] dist 目录未生成
    goto ERR
)

echo.
echo =============================================
echo    [完成] dist 已生成
echo    路径: %CD%\dist
echo =============================================
echo.
echo 部署到 iPhone PWA:
echo   1) 把 dist 文件夹压缩成 zip
echo   2) 登录 https://dash.cloudflare.com/
echo   3) Workers 和 Pages / Create / Pages / 上传资产
echo   4) 把 zip 拖进去, 等待部署
echo   5) iPhone Safari 打开链接 / 分享 / 添加到主屏幕
goto END

:DO_GIT
cls
echo =============================================
echo    [3] 上传 GitHub
echo =============================================
echo.

set /p msg=提交说明 (直接回车 = update):
if "%msg%"=="" set msg=update

git add . || goto ERR
git commit -m "%msg%" || goto ERR
git push origin main || goto ERR

echo.
echo =============================================
echo    [完成] GitHub 上传成功
echo    https://github.com/caoxueyang/--breadCook
echo =============================================
goto END

:DO_ALL
cls
echo =============================================
echo    一键全做 (dist + APK + GitHub)
echo =============================================
echo.

echo [1/4] 构建 dist...
call npm run build || goto ERR

echo [2/4] 打包 APK...
call npx cap sync android || goto ERR
cd android
call gradlew.bat assembleDebug || (cd .. & goto ERR)
cd ..

if not exist "android\app\build\outputs\apk\debug\app-debug.apk" (
    echo [X] 找不到 APK 文件
    goto ERR
)
copy /Y "android\app\build\outputs\apk\debug\app-debug.apk" "面包餐厅.apk" >nul
echo   OK: APK 已拷贝

echo [3/4] 准备提交到 GitHub...
set /p msg=提交说明 (直接回车 = update):
if "%msg%"=="" set msg=update

git add . || goto ERR
git commit -m "%msg%" || goto ERR

echo [4/4] 推送到 GitHub...
git push origin main || goto ERR

echo.
echo =============================================
echo    [完成] 全部成功
echo    dist   : %CD%\dist
echo    APK    : %CD%\面包餐厅.apk
echo    GitHub : 已更新
echo =============================================
goto END

:ERR
echo.
echo =============================================
echo    [失败] 上面有错误, 请检查日志
echo =============================================

:END
echo.
pause
