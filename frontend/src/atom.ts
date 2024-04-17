import { atom } from "recoil";

export interface userUsernames {
	old: string;
	curr: string;
}

export const loggedUserUsernameAtom = atom<string | undefined>({
	key: "loggedUserUsernameAtom",
	default: undefined,
});

export const isDarkModeAtom = atom<boolean>({
	key: "isDarkModeAtom",
	default: localStorage.getItem("darkMode") === "true",
});
