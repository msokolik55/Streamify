import { apiUrl } from "./env";

/**
 * Frontend paths
 */
export const livePath = "/live";
export const profilePath = "/profile";

export const userPath = "/user";
export const userProfilePath = `${userPath}/profile`;
export const userVideosPath = `${userPath}/video`;
export const userStreamKeyPath = `${userPath}/stream-key`;

export const loginPath = "/login";
export const streamPath = "/stream";

/**
 * Backend (API) paths
 */
export const apiUserUrl = `${apiUrl}${userPath}`;
export const apiLiveUrl = `${apiUrl}${livePath}`;
export const apiLoginUrl = `${apiUrl}${loginPath}`;
export const apiStreamUrl = `${apiUrl}${streamPath}`;
