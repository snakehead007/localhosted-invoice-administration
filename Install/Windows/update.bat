echo "stopping node process"

node win-stop.js

echo "updating..."

git stash
git pull

echo "starting node process"

node win-start.js
