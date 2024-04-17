import bcrypt from "bcrypt";
import { Strategy as LocalStrategy } from "passport-local";

import { findByUsername, getPassword } from "./resources/user";

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
		console.log(user);
		done(null, user.username);
	});
};

export const deserializeUser = (passport: any) => {
	passport.deserializeUser(async (username: string, done: any) => {
		try {
			const user = await findByUsername(username);
			done(null, user);
		} catch (error) {
			done(error);
		}
	});
};

//#endregion Passport
