#!/bin/bash

echo
kubectl delete deployment stream-orig
kubectl delete deployment stream-360p
kubectl delete deployment stream-720p
kubectl delete deployment stream-1080p
kubectl delete deployment redis
kubectl delete deployment cockroachdb
kubectl delete deployment backend
kubectl delete deployment frontend
