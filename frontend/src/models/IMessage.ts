export interface IMessage {
	id: string;
	content: string;
	answered: boolean;
	createdAt: Date;
	userId?: string;
	streamId: string;
}
