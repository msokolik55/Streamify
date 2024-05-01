#!/bin/bash

echo
kubectl apply -f deployments/stream-orig-deployment.yml
kubectl apply -f deployments/stream-360p-deployment.yml
kubectl apply -f deployments/stream-720p-deployment.yml
kubectl apply -f deployments/stream-1080p-deployment.yml
kubectl apply -f deployments/redis-deployment.yml
kubectl apply -f deployments/cockroachdb-deployment.yml
kubectl apply -f deployments/backend-deployment.yml
kubectl apply -f deployments/frontend-deployment.yml
