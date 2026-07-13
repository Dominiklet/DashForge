#!/bin/bash

if [ -f /data/mockData.json ]; then
    echo "Found mockData.json"
    json-server -p 3000 /data/mockData.json
else
    echo "No mockData.json found"
    exit 1
fi