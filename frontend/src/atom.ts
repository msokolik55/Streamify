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

export const LoggedUserIdAtom = atom<string | undefined>({
	key: "LoggedUserIdAtom",
	default: undefined,
});
