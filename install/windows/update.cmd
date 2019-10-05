echo update invoice-administration
net stop invoice-administration
git stash
git pull
net stop invoice-administration
echo update finished
echo starting invoice-administration
net start invoice-administration
echo if you get an error, please run this script as administration
