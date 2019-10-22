echo off
color a
cls
echo Please make sure this script is running "as administrator"
pause
cls
echo Are you sure you want to uninstall this application?
pause
color f
cls
echo starting uninstallation process
net stop invoice-administration
net stop test002
call node-v10.16.3-win-x64\node.exe win-uninstall.js
sc.exe delete invoice-administration
sc.exe delete test009
echo uninstallation should be complete
echo to check for sure, go to the "services" app in the start menu
pause
