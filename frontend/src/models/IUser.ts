import { IStream } from "./IStream";

export interface IUser {
	id: string;
	username: string;
	picture: string;
	email: string;
	count: number;
	streamKey: string | null;
	streams: IStream[];
}
