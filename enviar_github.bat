@echo off
echo ========================================
echo   ENVIANDO CATALOGO PARA O GITHUB
echo ========================================
echo.

cd /d C:\Users\wilso\catalogo-loja

echo [1/3] Adicionando arquivos...
git add .

echo [2/3] Commitando alteracoes...
git commit -m "Atualizacao catalogo %date% %time%"

echo [3/3] Enviando para o GitHub...
git push

echo.
echo ========================================
echo ✅ CATALOGO ENVIADO COM SUCESSO!
echo ========================================
echo.
pause