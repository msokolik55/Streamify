import { IUser } from "../models/IUser";

export const getActualStream = (user: IUser) => {
	return user.streams.filter((stream) => stream.path === user.streamKey)[0];
};
