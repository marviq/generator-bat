#!/bin/bash
if hash watchify 2>/dev/null; then
    echo ">>> Building project first... (debug)"
    grunt debug
    if [ $? -eq 1 ]; then
        echo ">>> Build failed!"
    else
        echo ">>> Starting watchify... please allow it to finish building once"
        watchify -d src/index.coffee src/**/*.hbs -o dist/src/bundle.js -v --extension=.coffee --extension=.hbs
    fi
else
    echo "You need to npm install -g watchify first."
    echo "Might need to use sudo depending on your system setup"
fi