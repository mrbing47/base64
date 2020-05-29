@echo off
setlocal

set STR=%1

if [%STR%] == []    echo "Provide a String to encode!!!"

if NOT [%STR%] == [] (
    cd /d "path to project"
    node index encode %STR%
)