const baseUrl = import.meta.env.VITE_API_URL;
const apiPort = import.meta.env.VITE_API_PORT;
const hlsPort = import.meta.env.VITE_HLS_PORT;

export const apiUrl = `${baseUrl}:${apiPort}`;
export const streamUrl = `${baseUrl}:${hlsPort}`;
