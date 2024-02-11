#!/bin/bash

kubectl delete configmap stream-config
kubectl delete service stream-service
kubectl delete deployment stream-deployment
