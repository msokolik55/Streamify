#!/bin/bash

echo
kubectl apply -f services/stream-orig-service.yml
kubectl apply -f services/stream-360p-service.yml
kubectl apply -f services/stream-720p-service.yml
kubectl apply -f services/stream-1080p-service.yml
kubectl apply -f services/redis-service.yml
kubectl apply -f services/cockroachdb-service.yml
kubectl apply -f services/backend-service.yml
kubectl apply -f services/frontend-service.yml
