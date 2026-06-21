#!/bin/bash

if [ -f /data/testdata.json ]; then
    echo "Found testdata.json"
    json-server --host 0.0.0.0 -p 3000 /data/testdata.json
else
    echo "No testdata.json found"
    ls -la /data
    exit 1
fi