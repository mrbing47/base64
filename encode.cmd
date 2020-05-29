@echo off
setlocal

set STR=%1

:loop

if "%2"=="" goto continue

set STR=%STR%=%2
shift
goto loop

:continue

if "%STR%" == ""    echo "Provide a String to encode!!!"

if NOT "%STR%" == "" (
    cd /d "path to project"
    node index encode "%STR%"
)