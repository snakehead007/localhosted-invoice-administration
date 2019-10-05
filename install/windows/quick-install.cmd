echo off
echo QUICK INSTALL -- you need to have installed all the npm packages in order to quick install
pause
echo [NPM]: linking node-windows
call node-v10.16.3-win-x64\npm.cmd link node-windows -s -q
echo [NODE]: installing invoice-administration
echo [NPM]: fixing vulnerabilities
call node-v10.16.3-win-x64\npm.cmd audit fix
echo [NPM]: updating
call node-v10.16.3-win-x64\node.exe node win-install.js
echo Installation is complete, you can close the program
pause
