echo "Starting installation"
git stash
git pull
node win-install.js
npm link node-windows //
echo "Installation is complete, you can close the program"
pause
