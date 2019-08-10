echo "updating as V1.6"
echo "stashing..."
git stash
echo "updating files..."
git pull
echo "starting server..."
node nodeservice.js
