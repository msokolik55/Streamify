import bcrypt from "bcrypt";
import { Strategy as LocalStrategy } from "passport-local";

import { logInfo } from "./logger";
import { findByUsername, getPassword } from "./resources/user";

export const authenticate = (passport: any) => {
	logInfo("auth", authenticate.name, "Initializing passport.");

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
	logInfo("auth", serializeUser.name, "Serializing user.");

	passport.serializeUser((user: any, done: any) => {
		done(null, user.username);
	});
};

export const deserializeUser = (passport: any) => {
	logInfo("auth", deserializeUser.name, "Deserializing user.");

	passport.deserializeUser(async (username: string, done: any) => {
		try {
			const user = await findByUsername(username);
			done(null, user);
		} catch (error) {
			done(error);
		}
	});
};
