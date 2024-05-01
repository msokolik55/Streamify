#!/bin/bash

echo
kubectl delete service stream-orig
kubectl delete service stream-360p
kubectl delete service stream-720p
kubectl delete service stream-1080p
kubectl delete service redis
kubectl delete service cockroachdb
kubectl delete service backend
kubectl delete service frontend
