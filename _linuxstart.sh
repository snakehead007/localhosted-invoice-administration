#!/bin/bash
echo "[I] STARTING MONGOD....."
mongod &
echo "[I] STARTING NODEJS....."
node . &
echo "MongoDB & NodeJS are up!";
read -n1 -r -p "[I]TO STOP PRESS ANY KEY" key
killall node
killall mongod 
echo "Succesfully stopped
