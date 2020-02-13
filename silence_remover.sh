#!/bin/bash -e

source_wav=$1
output_wav=$2

echo "TEST SCRIPT"
echo $1
echo $2

#sox ${source_wav} out41.wav silence 1 0.1 1% -1 0.1 1%

sox ${source_wav} ${output_wav} silence 1 0.1 1% -1 0.5 1%