#!/bin/bash -eo pipefail
static_markup=$(php index.php)

if [[ $? -eq 0 ]]; then
    echo $static_markup > index.html
else
    echo "build exited with status $?, output:"
    echo "$static_markup"
    exit 1
fi