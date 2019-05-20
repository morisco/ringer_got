#!/bin/bash -eo pipefail
echo $PWD;
static_markup=$(php index.php)

if [[ $? -eq 0 ]]; then
    echo $static_markup > indexpz.html
else
    echo "build exited with status $?, output:"
    echo "$static_markup"
    exit 1
fi