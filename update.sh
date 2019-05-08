echo "updating as V1.6"
echo "stashing..."
git stash
git "updating files..."
git pull
echo "updating npm packages.."
npm install express jade mongodb mongoose forever forever-monitor chartjs --save
echo "starting server..."
node index.js
