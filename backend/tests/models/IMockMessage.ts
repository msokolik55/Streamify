export interface IMockMessage {
	id: string;
	content: string;
	answered: boolean;
	createdAt: Date;
	streamKey: string;
	username: string | null;
}
