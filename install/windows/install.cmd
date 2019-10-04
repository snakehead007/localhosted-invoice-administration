echo "Starting installation"
git stash
git pull
echo "installing NPM/NPX"
call .\node-v10.16.3-win-x64\npx.cmd
echo "executing nodevars"
call .\node-v10.16.3-win-x64\nodevars.bat
node win-install.js
npm link node-windows
echo "Installation is complete, you can close the program"
pause
