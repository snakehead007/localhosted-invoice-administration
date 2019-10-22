echo off
cls
color A
echo -------------------------------------
echo [IMPORTANT]: PLEASE RUN THIS AS ADMINISTRATOR
echo -------------------------------------
pause
color F
cls
echo update invoice-administration
net stop invoice-administration
git stash
git pull
net stop invoice-administration
echo update finished
echo starting invoice-administration
net start invoice-administration
echo ---------------
echo update complete
echo ---------------
pause
