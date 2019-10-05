echo off
cls
echo "Starting installation:"
call node-v10.16.3-win-x64\nodevars.bat
echo "[NPM]: installing express"
call node-v10.16.3-win-x64\npm.cmd install -g express --save -s -q
echo "[NPM]: pug"
call node-v10.16.3-win-x64\npm.cmd install -g pug --save -s -q
echo "[NPM]: mongodb"
call node-v10.16.3-win-x64\npm.cmd install mongodb -g --save -s -q
echo "[NPM]: mongoose"
call node-v10.16.3-win-x64\npm.cmd install -g mongoose --save -s -q
echo "[NPM]: node-windows"
call node-v10.16.3-win-x64\npm.cmd install -g node-windows --save -s -q
echo "[NPM]: chartjs"
call node-v10.16.3-win-x64\npm.cmd install -g chartjs --save -s -q
echo "[NPM]: express-fileupload"
call node-v10.16.3-win-x64\npm.cmd install -g express-fileupload --save -s -q
echo "[NPM]: image-to-base64"
call node-v10.16.3-win-x64\npm.cmd install -g image-to-base64 --save -s -q
echo "installing packages - done!"
echo "[NPM]: linking node-windows"
call node-v10.16.3-win-x64\npm.cmd link node-windows -s -q
echo "[NODE]: installing invoice-administration"
node win-install.js
echo "Installation is complete, you can close the program"
