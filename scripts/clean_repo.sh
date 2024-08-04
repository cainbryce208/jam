#!/usr/bin/env bash

# cleans repo locally of node_modules

if [ -d "src/node_modules" ]; then
    rm -rf -v "src/node_nodules"
    exit 0
else
    echo "No node modules in src. Exiting"
    exit 1
fi;
