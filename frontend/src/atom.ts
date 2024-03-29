import { atom } from "recoil";

const defaultUsername = "";

export interface userUsernames {
	old: string;
	curr: string;
}

export const userUsernamesAtom = atom<userUsernames>({
	key: "userUsernamesAtom",
	default: { old: defaultUsername, curr: defaultUsername },
});

export const loggedUserUsernameAtom = atom<string | undefined>({
	key: "loggedUserUsernameAtom",
	default: undefined,
});

export const isDarkModeAtom = atom<boolean>({
	key: "isDarkModeAtom",
	default: false,
});
