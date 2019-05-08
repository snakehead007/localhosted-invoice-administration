echo "updating as V1.6"
echo "stashing..."
git stash
git "updating files..."
git pull
echo "updating npm packages.."
npm update
echo "starting server..."
node index.jst
