#!/bin/zsh
function fileloc {
    local fileCall=${BASH_SOURCE[0]:-${(%):-%x}}
    local absFileCall=$(realpath $fileCall)
    local parentFolder=${absFileCall%/*}
    echo $parentFolder
}

ROOT=$(fileloc)
cd $ROOT/html
python3 -m http.server 8080
