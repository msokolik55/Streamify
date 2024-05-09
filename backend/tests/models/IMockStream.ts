export interface IMockStream {
	id: string;
	name: string;
	description: string;
	path: string;
	ended: boolean;
	maxCount: number;
	createdAt: Date;
	updatedAt: Date;

	userId: string | null;
}
