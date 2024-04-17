import { IMessage } from "./IMessage";
import { IUser } from "./IUser";

export interface IStream {
	id: string;
	name: string;
	path: string;
	createdAt: string;
	updatedAt: string;
	user: IUser;
	maxCount: number;
	ended: boolean;
	description: string;
	messages: IMessage[];
}
