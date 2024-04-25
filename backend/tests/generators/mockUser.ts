import { faker } from "@faker-js/faker";

import { IMockUser } from "../models/IMockUser";
import { transformAny } from "../utils/transformer";

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

export const transformUser = (user: IMockUser) => {
	return transformAny(user) as IMockUser;
};

export const mockUser = generateUser();
export const mockUsers = Array.from({ length: 3 }, generateUser);
