import { faker } from "@faker-js/faker";

import { IMockStream } from "../models/IMockStream";
import { transformAny } from "../utils/transformer";

export const generateStream = (): IMockStream => {
	return {
		id: faker.string.uuid(),
		name: faker.commerce.productName(),
		description: faker.lorem.sentence(),
		path: faker.string.uuid(),
		ended: faker.datatype.boolean(),
		maxCount: faker.number.int(),
		createdAt: faker.date.past(),
		updatedAt: faker.date.recent(),

		userId: faker.string.uuid(),
	};
};

export const transformStream = (stream: IMockStream) => {
	return transformAny(stream) as IMockStream;
};

export const mockStream = generateStream();
export const mockStreams = Array.from({ length: 5 }, generateStream);
