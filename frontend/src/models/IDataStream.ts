import { IStream } from "./IStream";

export interface IDataStream {
	status: string;
	data: IStream;
}

export interface IDataStreams {
	status: string;
	data: IStream[];
}
