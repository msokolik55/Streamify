import { apiUrl } from "./env";

/**
 * Frontend paths
 */
export const livePath = "/live";
export const profilePath = "/profile";
export const userPath = "/user";
export const loginPath = "/login";

/**
 * Backend (API) paths
 */
export const apiUserUrl = `${apiUrl}${userPath}`;
export const apiLiveUrl = `${apiUrl}${livePath}`;
export const apiLoginUrl = `${apiUrl}${loginPath}`;
