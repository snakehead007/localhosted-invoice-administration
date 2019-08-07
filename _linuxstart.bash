#!/bin/bash

#This is script is an automated server start for linux, starts the database and node
#run with sudo to ensure 'killall' command works, you might need sudo also on the 'monogd' command.

clear
printf "\nSTARTING MONGOD\n"
mongod --quiet &     #starts mongod as deamon
sleep 3     #waits for connection start, no more than 3 seconds
printf "\nSTARTING NODEJS\n"
node . &    #starts node in directory (index.js)
printf "\nMongoDB & NodeJS are up!\n";
read -n1 -r -p "\nPress any key to stop-\n";    #when any key is pressed, the script will commence

printf "\nKilling Node & Mongod\n";
killall node;   #kills the node process
mongod --shutdown;   #kills the mongod process

while true; do
	read -p "Do you want to restart the script? (y/n) " yn
    case $yn in
        [Yy]* ) bash _linuxstart.bash; break;;
        [Nn]* ) exit;;
        * ) echo "Please answer yes or no.";;
    esac
done
