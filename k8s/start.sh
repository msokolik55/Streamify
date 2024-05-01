#!/bin/bash

./clean.sh

./configs/start.sh
./volumes/start.sh
./deployments/start.sh
./services/start.sh

echo
kubectl get deployments

echo
kubectl get services

echo
kubectl get pods

echo
