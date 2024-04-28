export const baseUrl = import.meta.env.VITE_API_URL;
const apiPort = import.meta.env.VITE_API_PORT;
const hlsPort = import.meta.env.VITE_HLS_PORT;
export const environment = import.meta.env.VITE_MODE;

export const apiUrl = `${baseUrl}:${apiPort}`;
export const streamUrl = `${baseUrl}:${hlsPort}`;

export const hyperdxKey = import.meta.env.VITE_HYPERDX_KEY;
