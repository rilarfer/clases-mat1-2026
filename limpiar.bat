@echo off

echo Limpiando archivos basura generados...
del *.aux *.log *.nav *.out *.snm *.toc *.vrb *.fls *.fdb_latexmk *.xdv *.synctex.gz 2>nul

echo.
echo =========================================
echo !COMPILACION EXITOSA Y CARPETA LIMPIA!
echo =========================================
pause
