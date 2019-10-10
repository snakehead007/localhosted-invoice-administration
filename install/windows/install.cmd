echo off
cls
color a
echo Please make sure that this is run as administration!
pause
cls
echo Starting installation
call node-v10.16.3-win-x64\nodevars.bat
echo [NPM]: installing express
call node-v10.16.3-win-x64\npm.cmd install -g express --save -s -q
call node-v10.16.3-win-x64\npm.cmd install express --save -s -q
echo [NPM]: pug
call node-v10.16.3-win-x64\npm.cmd install -g pug --save -s -q
call node-v10.16.3-win-x64\npm.cmd install pug --save -s -q
echo [NPM]: mongodb
call node-v10.16.3-win-x64\npm.cmd install mongodb -g --save -s -q
call node-v10.16.3-win-x64\npm.cmd install mongodb --save -s -q
echo [NPM]: mongoose
call node-v10.16.3-win-x64\npm.cmd install -g mongoose --save -s -q
call node-v10.16.3-win-x64\npm.cmd install mongoose --save -s -q
echo [NPM]: node-windows
call node-v10.16.3-win-x64\npm.cmd install -g node-windows --save -s -q
call node-v10.16.3-win-x64\npm.cmd install node-windows --save -s -q
echo [NPM]: chartjs
call node-v10.16.3-win-x64\npm.cmd install -g chartjs --save -s -q
call node-v10.16.3-win-x64\npm.cmd install chartjs --save -s -q
echo [NPM]: express-fileupload
call node-v10.16.3-win-x64\npm.cmd install -g express-fileupload --save -s -q
call node-v10.16.3-win-x64\npm.cmd install express-fileupload --save -s -q
echo [NPM]: image-to-base64
call node-v10.16.3-win-x64\npm.cmd install -g image-to-base64 --save -s -q
call node-v10.16.3-win-x64\npm.cmd install image-to-base64 --save -s -q
echo installing packages - done!
echo [NPM]: linking node-windows
call node-v10.16.3-win-x64\npm.cmd link node-windows -s -q
echo [NODE]: installing invoice-administration
echo [NPM]: fixing vulnerabilities
call node-v10.16.3-win-x64\npm.cmd audit fix
echo [NPM]: DONE!
echo [MONGODB]: making files ready
mkdir c:\data\db
echo [MONGODB]: installing mongod
sc.exe create invoice-database-test06 binPath= "%CD%\mongodb-win32-x86_64-2012plus-4.2.0\bin\mongod.exe --bind_ip localhost" start="auto"
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
