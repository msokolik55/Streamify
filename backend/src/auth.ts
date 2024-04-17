import bcrypt from "bcrypt";
import { Strategy as LocalStrategy } from "passport-local";

import prisma from "./client";
import { getPassword } from "./resources/user";

export const authenticate = (passport: any) => {
	passport.use(
		new LocalStrategy(async (username, password, done) => {
			try {
				const user = await getPassword(username);
				if (!user) {
					return done(null, false, {
						message: "Incorrect username.",
					});
				}

				const isValid = await bcrypt.compare(password, user.password);
				if (!isValid) {
					return done(null, false, {
						message: "Incorrect password.",
					});
				}

				return done(null, user);
			} catch (error) {
				return done(error);
			}
		}),
	);
};

export const serializeUser = (passport: any) => {
	passport.serializeUser((user: any, done: any) => {
		done(null, user.id);
	});
};

export const deserializeUser = (passport: any) => {
	passport.deserializeUser(async (id: string, done: any) => {
		try {
			const user = await prisma.user.findUnique({
				where: { id },
			});
			done(null, user);
		} catch (error) {
			done(error);
		}
	});
};

//#endregion Passport
