export type LoginInputs = {
	username: string;
	password: string;
};

export type MessageInputs = {
	content: string;
};

export type StreamKeyInputs = {
	name: string;
	description: string;
};

export type StreamEditInputs = {
	id: string;
	name: string;
	description: string;
};

export type UserEditInputs = {
	id: string;
	username: string;
	email: string;
	picture?: FileList;
};

export type UserCreateInputs = {
	username: string;
	email: string;
	picture?: FileList;
	password: string;
};

export type PasswordEditInputs = {
	oldPassword: string;
	newPassword: string;
	confirmNewPassword: string;
};

export enum FormState {
	CREATE,
	UPDATE,
	END,
}
