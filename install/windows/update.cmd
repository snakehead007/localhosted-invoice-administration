echo "update simple-invoice-admisinstration"

net stop simple-invoice-admisinstration

git stash

git pull

net stop simple-invoice-admisinstration

echo "update finished"
