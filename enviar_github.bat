@echo off
echo ========================================
echo   ENVIANDO CATALOGO PARA O GITHUB
echo ========================================
echo.

cd /d "%~dp0" || exit /b 1
if not exist ".git\HEAD" exit /b 1

echo [1/3] Adicionando arquivos...
git add . || exit /b 1

echo [2/3] Commitando alteracoes...
git diff --cached --quiet
if errorlevel 1 (
    git commit -m "Atualizacao catalogo %date% %time%" || exit /b 1
)

echo [3/3] Enviando para o GitHub...
git push || (pause & exit /b 1)

echo.
echo ========================================
echo ✅ CATALOGO ENVIADO COM SUCESSO!
echo ========================================
echo.
pause
