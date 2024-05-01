#!/bin/bash

echo
kubectl apply -f volumes/shared-volume.yml
kubectl apply -f volumes/upload-volume.yml
kubectl apply -f volumes/redis-volume.yml
kubectl apply -f volumes/cockroachdb-volume.yml
