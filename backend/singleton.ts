import { PrismaClient } from "@prisma/client";
import { DeepMockProxy, mockDeep, mockReset } from "jest-mock-extended";

import prisma from "./src/client";

jest.mock("./src/client", () => ({
	__esModule: true,
	default: mockDeep<PrismaClient>(),
}));

jest.mock("fs", () => ({
	existsSync: jest.fn(() => true),
	readdirSync: jest.fn(() => ["test.jpg"]),
	unlinkSync: jest.fn(),
}));

jest.mock("bcrypt", () => ({
	hashSync: jest.fn(() => "hashedPassword"),
}));

beforeEach(() => {
	mockReset(prismaMock);
});

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;
