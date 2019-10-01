echo "Starting installation"
echo "stashing..."
git stash
echo "updating files..."
git pull
echo "installing node files"
node win-install.js
echo "Installation is complete, you can close the program"
pause
echo "Linking node-windows";
npm link node-windows;
