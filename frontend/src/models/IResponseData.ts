export interface IResponseData<T> {
	status: string;
	data: T;
}

export interface IResponseDatas<T> {
	status: string;
	data: T[];
}
