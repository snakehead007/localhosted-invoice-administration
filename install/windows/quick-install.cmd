echo off
color a
cls
echo Please make sure this script is running "as administrator"
pause
cls
echo QUICK INSTALL -- you need to have installed all the npm packages in order to quick install
pause
color f
cls
echo [MONGODB]: making files ready
mkdir C:\data\db
mkdir C:\data\log\
echo [MONGODB]: installing mongod
sc.exe create test009 binPath= "\"%CD%\mongodb-win32-x86_64-2012plus-4.2.0\bin\mongod.exe\" --service --dbpath=\"c:\data\db\"" start= auto
net start test009
echo [NPM]: linking node-windows
call node-v10.16.3-win-x64\npm.cmd link node-windows -s -q
echo [NODE]: installing invoice-administration
color A
echo -------------------------------------
echo [IMPORTANT]: PLEASE SAY "YES" TO ALL!
echo -------------------------------------
sc.exe
call node-v10.16.3-win-x64\node.exe win-install.js
net start invoice-administration
color F
echo Installation is complete, you can close the program
pause
