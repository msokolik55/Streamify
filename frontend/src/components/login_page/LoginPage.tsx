import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useSetRecoilState } from "recoil";

import { loggedUserIdAtom } from "../../atom";
import { logInfo } from "../../logger";
import { LoginInputs } from "../../models/form";
import { apiLoginUrl, registerPath } from "../../urls";
import FormLabel from "./FormLabel";

const LoginPage = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginInputs>();

	const setLoggedUserId = useSetRecoilState(loggedUserIdAtom);
	const [errorMessage, setErrorMessage] = useState<string | undefined>();

	const onSubmit = async (data: LoginInputs) => {
		logInfo("Fetching: LoginPage.onSubmit");

		const res = await fetch(apiLoginUrl, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		});

		const resData = await res.json();

		const loginSuccess = resData.data;
		const loginError = resData.error;

		if (loginSuccess) setLoggedUserId(data.username);
		else setErrorMessage(loginError);
	};

	return (
		<div>
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
								className="leading-6 text-sm py-1 px-2 border-0 rounded-md w-full block bg-gray-800"
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
								className="leading-6 text-sm py-1 px-2 border-0 rounded-md w-full block bg-gray-800"
								aria-invalid={
									errors.password ? "true" : "false"
								}
							/>
						</div>
					</div>

					<div className="text-sm text-red-500">{errorMessage}</div>

					<div>
						<button
							className="leading-6 font-semibold text-sm py-1 px-3 rounded-md justify-center w-full flex bg-gray-500 mt-2 hover:bg-gray-600"
							type="submit"
						>
							Sign in
						</button>
					</div>
				</form>

				<Link to={registerPath}>
					<div className="text-sm text-blue-300 mt-2 hover:text-blue-500">
						Don't you have an account? Register here
					</div>
				</Link>
			</div>
		</div>
	);
};

export default LoginPage;
