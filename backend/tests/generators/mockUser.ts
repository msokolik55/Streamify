import { faker } from "@faker-js/faker";

import { IMockUser } from "../models/IMockUser";

export const generateUser = (live?: boolean): IMockUser => {
	return {
		id: faker.string.uuid(),
		username: faker.internet.userName(),
		email: faker.internet.email(),
		password: faker.internet.password(),
		picture: faker.image.avatar(),
		createdAt: faker.date.past(),
		updatedAt: faker.date.recent(),
		streamKey: live ? faker.string.uuid() : null,
	};
};

export const mockUser = generateUser();
export const mockUsers = Array.from({ length: 3 }, generateUser);
