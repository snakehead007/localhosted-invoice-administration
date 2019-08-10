#!/bin/bash

#This is script is an automated server start for linux, starts the database and node
#run with sudo to ensure 'killall' command works, you might need sudo also on the 'monogd' command.

#Global variables
QUIET='false'
VERBOSE='false';
NODE='false';
package="_linuxstart.bash";
function start_all_quiet(){
	mongod --quiet &
	sleep 3
	node start &
}
	
function start_node(){
	node . &
}

function start_node_quiet(){
	node . & nohup &
}
function start_all(){
	mongod &
	sleep 3
	node . &
}

function stop_all(){
	mongod --shutdown
	killall node
}


function stop_node(){
	killall node
}

function start_all_c(){
	echo "starting all"
	if [ $QUIET == 'true' ]
	then
		start_all_quiet
	else
		start_all
	fi
}

function restart(){
	echo "restarting"
	if [ $NODE == 'true' ]
	then
		restart_node
	else
		stop_all
		start_all_c
	fi
}

function restart_node(){
	stop_node
	if [ $QUIET == 'true' ]
	then
		start_node_quiet
	else
		start_node
	fi
}

function start(){
start_all_c
while true; do        	
	read -n1 -r -p "\nPress any key to stop-\n"    #when any key is pressed, the script will commence
	read -p "Do you want to restart the script? (y/n) " yn
    case $yn in
        [Yy]* ) 
		restart
		;;
        [Nn]* ) 
		stop_all
		exit
		;;
        * ) 
		echo "Please answer yes or no."
		;;
    esac
done
}
while test $# -gt 0; do
  case "$1" in
   	 -h|--help)
      		echo "$package - script to start and restart database and server";
		echo " ";
		echo "$package [option]";
      	 	echo " ";
	  	echo "options:";
	   	echo "-h, --help  	:	shows this message";
	    	echo "-n, --node	:	Only restarts node";
	     	echo "-q, --quiet	:	no output is shown";
	      	echo "-v, --verbose	:	verbose output (more output)";
		echo '-a		: 	starts the script in normal mode';
	      	exit 0
	      	;;
   	-n|--node)
		NODE='true'
		echo "Starting node only mode"
		start
		;;	
	-q|--quiet)	
		QUIET='true'
		echo 'start script'
		start
		;;
	-v|--verbose)
		VERBOSE="true"
		echo 'Starting in verbose mode'
		start
		;;
	-a )
		start
		;;
	*)	
		echo "use $package -h for the help message"
      		break
      		;;
esac
done


