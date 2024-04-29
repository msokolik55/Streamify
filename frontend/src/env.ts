export const environment = import.meta.env.VITE_MODE;
export const hyperdxKey = import.meta.env.VITE_HYPERDX_KEY;

export const baseUrl = import.meta.env.VITE_API_URL;
const apiPort = import.meta.env.VITE_API_PORT;

export const apiUrl = `${baseUrl}:${apiPort}`;

export const port360p = import.meta.env.VITE_PORT_360P;
export const port720p = import.meta.env.VITE_PORT_720P;
export const port1080p = import.meta.env.VITE_PORT_1080P;
