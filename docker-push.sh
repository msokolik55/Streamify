#!/bin/bash

docker build -t msokolik55/backend:latest ./backend
docker build -t msokolik55/frontend:latest ./frontend

docker push msokolik55/backend:latest
docker push msokolik55/frontend:latest
