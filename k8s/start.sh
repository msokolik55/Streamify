#!/bin/bash

kubectl delete configmap stream-config
kubectl delete service stream-service
kubectl delete deployment stream-deployment

kubectl create configmap stream-config --from-file=mediamtx.yml
kubectl apply -f stream-deployment.yml
kubectl apply -f stream-service.yml

echo
kubectl get deployments

echo
kubectl get services

echo
kubectl get pods

echo
