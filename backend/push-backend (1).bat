@echo off
echo ========================================
echo    PUSH BACKEND - Converse com Maria
echo ========================================
echo.

cd /d "C:\Users\sss\Pictures\x DEPLOY\proj_maria\backend"

echo Adicionando arquivos...
git add .

echo.
set /p MSG="Mensagem do commit (ou Enter para padrao): "
if "%MSG%"=="" set MSG=atualizacao backend

echo.
echo Fazendo commit: %MSG%
git commit -m "%MSG%"

echo.
echo Enviando para GitHub...
git push

echo.
echo ========================================
echo    PUSH CONCLUIDO!
echo ========================================
echo.
pause
