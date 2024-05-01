#!/bin/bash

echo
kubectl create configmap stream-config --from-file=mediamtx.yml=configs/mediamtx.yml
kubectl create configmap stream-360p-config --from-file=mediamtx.yml=configs/mediamtx-360p.yml
kubectl create configmap stream-720p-config --from-file=mediamtx.yml=configs/mediamtx-720p.yml
kubectl create configmap stream-1080p-config --from-file=mediamtx.yml=configs/mediamtx-1080p.yml
