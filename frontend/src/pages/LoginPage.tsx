import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Helmet } from "react-helmet";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";

import { loggedUserUsernameAtom } from "../atom";
import { login } from "../auth";
import Heading1 from "../components/Heading1";
import { logError, logInfo } from "../logger";
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

	const onSubmit = async (data: LoginInputs) => {
		logInfo(LoginPage.name, onSubmit.name, "Fetching");

		try {
			const response = await login(data);

			const resData = response.data;

			const loginSuccess = resData.data;

			if (loginSuccess) {
				setLoggedUserUsername(data.username);
				navigate(userProfilePath);
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

	return (
		<div>
			<Helmet>
				<title>Login - Streamify</title>
			</Helmet>
			<div className="text-center mt-10">
				<Heading1 title="Sign in to your account" />
			</div>
			<form
				className="flex flex-col gap-3 max-w-sm w-full mx-auto my-10"
				onSubmit={handleSubmit(onSubmit)}
			>
				<div className="flex flex-col gap-2">
					<label htmlFor="username">Username</label>
					<InputText
						{...register("username", {
							required: true,
							minLength: 3,
							pattern: /"[a-zA-Z0-9_]{3,}"/,
						})}
						id="username"
						name="username"
						type="text"
						required={true}
						minLength={3}
						pattern="[a-zA-Z0-9_]{3,}"
						aria-invalid={errors.username ? "true" : "false"}
					/>
				</div>

				<div className="flex flex-col gap-2">
					<label htmlFor="password">Password</label>
					<InputText
						{...register("password", { required: true })}
						id="password"
						name="password"
						type="password"
						required={true}
						aria-invalid={errors.password ? "true" : "false"}
					/>
				</div>

				<Button
					className="w-full flex justify-center"
					label="Sign in"
					type="submit"
				/>

				<Link to={registerPath}>
					<Button
						className="w-full flex justify-center p-button-text"
						label="Don't you have an account? Register here"
					/>
				</Link>
			</form>
		</div>
	);
};

export default LoginPage;
