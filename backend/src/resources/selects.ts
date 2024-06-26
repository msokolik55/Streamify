export const UserSelect = {
	id: true,
	username: true,
	email: true,
	picture: true,
	createdAt: true,
	updatedAt: true,
	streamKey: true,
	streams: true,
};

export const StreamSelect = {
	id: true,
	name: true,
	path: true,
	maxCount: true,
	ended: true,
	description: true,
	createdAt: true,
	updatedAt: true,
	messages: true,
};

const UserAvatarSelect = {
	picture: true,
	username: true,
};

const StreamInfoSelect = {
	id: true,
	createdAt: true,
	name: true,
	path: true,
	maxCount: true,
	ended: true,
	description: true,
	messages: true,
	user: true,
};

export const UserDetailSelect = {
	...UserSelect,
	streams: {
		select: StreamInfoSelect,
	},
};

export const StreamDetailSelect = {
	...StreamSelect,
	user: {
		select: UserAvatarSelect,
	},
};

export const MessageSelect = {
	id: true,
	content: true,
	answered: true,
	createdAt: true,
	username: true,
	streamKey: true,
};
