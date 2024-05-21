# SBAPR-prototype

This project is a web application that consists of a frontend and a backend, providing a streaming functionality using Docker and OBS Studio. The entire project can be easily started using Docker Compose.

## Prerequisites

-   [Docker](https://www.docker.com/) installed on your machine.

## Getting Started

To get started with the project, follow the steps below:

1. Clone this repository to your local machine:

```bash
git clone https://github.com/msokolik55/SBAPR-prototype.git
```

2. Navigate to the project directory:

```bash
cd Streamify
```

3. Start the project using Docker Compose:

```bash
docker-compose up
```

Or start the project using Kubernetes via `k8s/start.sh` bash file:

```bash
cd k8s
./start.sh
```

This will launch the frontend, backend, and the streaming service containers.

## Project Structure

-   **frontend/**

    -   This folder contains the frontend of the application.
    -   The frontend exposes itself on http://localhost:8080.
    -   It fetches data from the backend.

-   **backend/**

    -   This folder contains the backend of the application.
    -   The backend exposes itself on http://localhost:4000.
    -   It provides the data required by the frontend.

## Streaming Functionality

The project includes a streaming functionality using the Docker image "mediamtx". To start the stream, follow these steps:

1. Navigate to a specific profile page on the frontend.
2. Click on the "Go live" button.

This will generate a stream key.

1. Open OBS Studio and go to Settings > Stream.
2. Choose "Custom" as the service.
3. Set the Server to `rtmp://localhost`.
4. Set the Stream Key to the generated stream key.

Now, your OBS Studio is configured to stream using the generated stream key.

## Cleanup

-   To stop and remove the containers, run the following command:

```bash
docker-compose down
```

-   To stop and remove the Kubernetes containers, run the following commands:

```bash
cd k8s
./clean.sh
```

## Additional Information

-   For more details on Docker Compose, refer to the [official documentation](https://docs.docker.com/compose/).
-   Make sure your OBS Studio is configured correctly with the provided stream key for streaming functionality.
