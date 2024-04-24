export interface IMockUser {
	id: string;
	username: string;
	email: string;
	picture: string | null;
	createdAt: Date;
	updatedAt: Date;
	streamKey: string | null;
	password: string;
}
