import { faker } from "@faker-js/faker";

import { IMockMessage } from "../models/IMockMessage";
import { transformAny } from "../utils/transformer";

export const generateMessage = (): IMockMessage => {
	return {
		id: faker.string.uuid(),
		content: faker.lorem.sentence(),
		answered: faker.datatype.boolean(),
		username: faker.internet.userName(),
		createdAt: faker.date.past(),
		streamKey: faker.string.uuid(),
	};
};

export const transformMessage = (message: IMockMessage) => {
	return transformAny(message) as IMockMessage;
};

export const mockMessage = generateMessage();
export const mockMessages = Array.from({ length: 5 }, generateMessage);
