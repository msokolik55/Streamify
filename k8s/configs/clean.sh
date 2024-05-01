#!/bin/bash

echo
kubectl delete configmap stream-config
kubectl delete configmap stream-360p-config
kubectl delete configmap stream-720p-config
kubectl delete configmap stream-1080p-config
