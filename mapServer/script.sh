#!/bin/bash
x=1
while [ $x -le 1000 ]
do
  echo "Welcome $x times"
  x=$(( $x + 1 ))
  sleep 1
done