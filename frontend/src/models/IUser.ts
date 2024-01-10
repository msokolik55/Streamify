export interface IUser {
	id: string;
	username: string;
	picture: string;
	email: string;
	count: number;
	live: boolean;
	streamKey: string | null;
}
