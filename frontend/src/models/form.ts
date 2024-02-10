export type LoginInputs = {
	username: string;
	password: string;
};

export type StreamKeyInputs = {
	name: string;
};

export type StreamEditInputs = {
	id: string;
	name: string;
};

export type UserEditInputs = {
	id: string;
	username: string;
	email: string;
	picture: string;
};
