export interface IMessage {
	id: string;
	content: string;
	createdAt: Date;
	userId?: string;
	streamId: string;
}
