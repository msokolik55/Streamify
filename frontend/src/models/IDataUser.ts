import { IUser } from "./IUser";

export interface IDataUser {
	status: string;
	data: IUser;
}

export interface IDataUsers {
	status: string;
	data: IUser[];
}
