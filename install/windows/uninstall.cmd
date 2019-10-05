echo off
cls
echo starting uninstallation process
net stop invoice-administration
call node-v10.16.3-win-x64\node.exe win-uninstall.js
echo uninstallation should be complete
echo to check for sure, go to the "services" app in the start menu
pause
