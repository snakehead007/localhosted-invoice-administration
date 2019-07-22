#!/bin/bash
echo "[I] STARTING MONGOD....."
mongod &
echo "[I] STARTING NODEJS....."
node . &
echo "MongoDB & NodeJS are up!";
read -n1 -r -p "Press any key to stop..." key
killall node
killall mongod 
