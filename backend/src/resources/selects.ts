export const UserSelect = {
	id: true,
	username: true,
	email: true,
	picture: true,
	createdAt: true,
	updatedAt: true,
	count: true,
	streamKey: true,
};

export const StreamSelect = {
	id: true,
	name: true,
	path: true,
	ended: true,
	description: true,
	createdAt: true,
	updatedAt: true,
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
	ended: true,
	description: true,
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
