import { apiUrl } from "./env";

/**
 * Frontend paths
 */
const userPath = "/user";
export const livePath = `/live`;
export const profilePath = `/profile`;

/**
 * Backend (API) paths
 */
export const apiUserUrl = `${apiUrl}${userPath}`;
export const apiLiveUrl = `${apiUrl}${livePath}`;
