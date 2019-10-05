echo off
cls
echo QUICK INSTALL -- you need to have installed all the npm packages in order to quick install
pause
echo [NPM]: linking node-windows
call node-v10.16.3-win-x64\npm.cmd link node-windows -s -q
echo [NODE]: installing invoice-administration
cls
color A
echo -------------------------------------
echo [IMPORTANT]: PLEASE SAY "YES" TO ALL!
echo -------------------------------------
call node-v10.16.3-win-x64\node.exe win-install.js
color F
cls
echo Installation is complete, you can close the program
pause
