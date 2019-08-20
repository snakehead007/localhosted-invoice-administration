#!/bin/bash

#This is script is an automated server start for linux, starts the database and node
#run with sudo to ensure 'killall' command works, you might need sudo also on the 'monogd' command.

#Global variables
QUIET='false'
VERBOSE='false';
NODE='false';
package="start.bash";
function start_all_quiet(){
	nohup mongod --quiet &
	sleep 3
	nodemon start 
}
	
function start_node(){
	nodemon . 
}

function start_node_quiet(){
	nohup nodemon . 
}
function start_all(){
	mongod &
	sleep 3
	nodemon . 
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
		echo "without flags	:	restarts mongodb and node every restart";
	      	exit 0
	      	;;
   	-n|--node)
		case "$2" in
			-q|--quiet)
				QUIET='true'	
		esac
		NODE='true'
		echo "Starting node only mode"
		start_all_c
		;;	
	-q|--quiet)
		case "$2" in
			-n|--node)
				NODE='true'
		esac
		QUIET='true'
		echo 'start script'
		start_all_c
		;;
	-v|--verbose)
		case "$2" in
			-n|--node)
				NODE='true'
		esac
		VERBOSE='true'
		echo 'Starting in verbose mode'
		start_all_c
		;;

	"")
		echo 'starting in normal mode'
		start_all_c
		;;
	*)	
		echo 'invalid argument(s)'
		echo "use the '-h' flag for the help message"
      		break
      		;;
esac

