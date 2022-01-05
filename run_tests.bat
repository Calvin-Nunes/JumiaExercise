cd %~dp0
@echo off
if not defined in_subprocess (cmd /k set in_subprocess=y ^& %0 %*) & exit )
echo "Iniciando Testes"
npm run test:unit
