// import axios from "axios";
import { useState } from "react";
import { Helmet } from "react-helmet";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";

import { loggedUserUsernameAtom } from "../atom";
import { login } from "../auth";
import FormLabel from "../components/FormLabel";
import { logError, logInfo } from "../logger";
// import { axiosConfig } from "../../models/fetcher";
import { LoginInputs } from "../models/form";
import { registerPath, userProfilePath } from "../urls";

const LoginPage = () => {
	const navigate = useNavigate();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginInputs>();

	const setLoggedUserUsername = useSetRecoilState(loggedUserUsernameAtom);
	const [errorMessage, setErrorMessage] = useState<string | undefined>();

	const onSubmit = async (data: LoginInputs) => {
		logInfo(LoginPage.name, onSubmit.name, "Fetching");

		try {
			const response = await login(data);

			const resData = response.data;

			const loginSuccess = resData.data;
			const loginError = resData.error;

			if (loginSuccess) {
				setLoggedUserUsername(data.username);
				navigate(userProfilePath);
			} else {
				setErrorMessage(loginError);
			}
		} catch (error) {
			logError(
				LoginPage.name,
				onSubmit.name,
				"Error submitting login form:",
				error,
			);
		}
	};

	const inputClassName =
		"block leading-6 text-sm py-1 px-2 border-0 rounded-md w-full \
		bg-gray-800 text-white \
		dark:bg-white dark:text-gray-800 \
		focus:outline-none focus:ring-2 focus:ring-blue-500";

	const buttonClassName =
		"flex leading-6 font-semibold text-sm py-1 px-3 mt-2 rounded-md justify-center w-full \
		bg-blue-400 text-black \
		dark:bg-blue-200 dark:text-blue-950 \
		hover:bg-blue-600 hover:text-white";

	return (
		<div>
			<Helmet>
				<title>Login - Streamify</title>
			</Helmet>
			<h1 className="tracking-tight font-bold text-2xl leading-8 text-center mt-10 m-0">
				Sign in to your account
			</h1>
			<div className="max-w-sm w-full mx-auto mt-10">
				<form
					className="flex flex-col gap-3"
					onSubmit={handleSubmit(onSubmit)}
				>
					<div>
						<FormLabel
							title="Username"
							for="username"
							required={false}
						/>
						<div className="mt-2">
							<input
								{...register("username", { required: true })}
								id="username"
								name="username"
								type="text"
								required={true}
								className={inputClassName}
								aria-invalid={
									errors.username ? "true" : "false"
								}
							/>
						</div>
					</div>

					<div>
						<FormLabel
							title="Password"
							for="password"
							required={false}
						/>
						<div className="mt-2">
							<input
								{...register("password", { required: true })}
								id="password"
								name="password"
								type="password"
								required={true}
								className={inputClassName}
								aria-invalid={
									errors.password ? "true" : "false"
								}
							/>
						</div>
					</div>

					<div className="text-sm text-red-500">{errorMessage}</div>

					<div>
						<button className={buttonClassName} type="submit">
							Sign in
						</button>
					</div>
				</form>

				<div className="text-sm text-blue-700 mt-2">
					<span>Don't you have an account? </span>
					<Link to={registerPath}>
						<span className="text-blue-500 hover:text-blue-300">
							Register here
						</span>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default LoginPage;
