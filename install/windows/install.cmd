echo off
cls
echo "Starting installation"
git stash
git pull
call node-v10.16.3-win-x64\nodevars.bat
npm install -g express --save;
npm install -g jade --save;
npm install mongodb -g --save;
npm install -g mongoose --save;
npm install -g node-windows --save;
npm install -g chartjs --save;
npm install -g express-fileupload --save;
npm install -g image-to-base64 --save;
npm link node-windows;
node win-install.js
npm link node-windows
echo "Installation is complete, you can close the program"
pause
