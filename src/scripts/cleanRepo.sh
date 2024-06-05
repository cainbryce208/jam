#!/bin/bash

##Script cleans node_modules directory if it exists


if [ -d "node_modules" ]; then 
    echo "node_modules dir exists. Cleaning.."
    rm -v -rf node_modules
    echo "Done. Exiting."
    sleep 2 && clear
    exit 0
    else
    echo "node_modules dir does not exist."
    exit 1
fi