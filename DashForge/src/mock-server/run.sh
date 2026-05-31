#!/bin/bash

if [ -f /data/db.json ]; then
    echo "Found testdata.json"
    json-server -p 3000 /data/db.json
else
    echo "No testdata.json found"
    exit 1
fi