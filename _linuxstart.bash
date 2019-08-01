#!/bin/bash

#This is script is an automated server start for linux, starts the database and node
#run with sudo to ensure 'killall' command works, you might need sudo also on the 'monogd' command.

clear
echo "------------------------------------------------------";
echo "-------------------STARTING MONGOD--------------------"
echo "------------------------------------------------------";
mongod &    #starts mongod as deamon
sleep 3     #waits for connection start, no more than 3 seconds
echo "------------------------------------------------------";
echo "-------------------STARTING NODEJS--------------------"
echo "------------------------------------------------------";
node . &    #starts node in directory (index.js)
echo "------------------------------------------------------";
echo "---------------MongoDB & NodeJS are up!---------------";
echo "------------------------------------------------------";
read -n1 -r -p "----------------Press any key to stop-----------------";    #when any key is pressed, the script will commence
echo "------------------------------------------------------";
echo "--------------Killing Node & Mongod-----------------";
echo "------------------------------------------------------";
killall node;   #kills the node process
killall mongod;   #kills the mongod process
