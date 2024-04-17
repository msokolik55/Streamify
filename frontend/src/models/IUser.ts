import { IStream } from "./IStream";

export interface IUser {
	id: string;
	username: string;
	picture: string;
	email: string;
	streamKey: string | null;
	streams: IStream[];
}
