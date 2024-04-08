import { apiUrl } from "./env";

/**
 * Frontend paths
 */
export const livePath = "/live";
export const profilePath = "/profile";
export const loginPath = "/login";
export const streamPath = "/streams";
export const registerPath = "/register";
export const passwordPath = "/password";
export const messagePath = "/messages";

export const userPath = "/users";
export const userProfilePath = `${userPath}/profile`;
export const userVideosPath = `${userPath}/video`;
export const userStreamKeyPath = `${userPath}/stream-key`;
export const userPasswordPath = `${userPath}/password`;

/**
 * Backend (API) paths
 */
export const apiUserUrl = `${apiUrl}${userPath}`;
export const apiLiveUrl = `${apiUrl}${userPath}${livePath}`;
export const apiLoginUrl = `${apiUrl}${loginPath}`;
export const apiStreamUrl = `${apiUrl}${streamPath}`;
export const apiPasswordUrl = `${apiUrl}${passwordPath}`;
export const apiMessageUrl = `${apiUrl}${messagePath}`;
