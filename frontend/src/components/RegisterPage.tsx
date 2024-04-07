import axios from "axios";
import { useState } from "react";
import { Helmet } from "react-helmet";
import { useForm } from "react-hook-form";
import { Navigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { useSWRConfig } from "swr";

import { loggedUserUsernameAtom } from "../atom";
import { logError, logInfo } from "../logger";
import { axiosConfig } from "../models/fetcher";
import { UserCreateInputs } from "../models/form";
import { apiUserUrl, userProfilePath } from "../urls";
import FormLabel from "./login_page/FormLabel";

const RegisterPage = () => {
	const setLoggedUserUsername = useSetRecoilState(loggedUserUsernameAtom);
	const [success, setSuccess] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<UserCreateInputs>();

	const { mutate } = useSWRConfig();
	const onSubmit = async (data: UserCreateInputs) => {
		logInfo(RegisterPage.name, onSubmit.name, "Fetching");

		try {
			await axios.post(
				apiUserUrl,
				{
					username: data.username,
					email: data.email,
					picture: data.picture,
					password: data.password,
				},
				axiosConfig,
			);

			mutate(apiUserUrl);
			setLoggedUserUsername(data.username);
			setSuccess(true);
		} catch (error) {
			logError(
				RegisterPage.name,
				onSubmit.name,
				"Error submitting form:",
				error,
			);
		}
	};

	return (
		<div className="flex flex-col gap-3 p-4">
			<Helmet>
				<title>Register - Streamify</title>
			</Helmet>
			{success && <Navigate to={userProfilePath} />}

			<form
				onSubmit={handleSubmit(onSubmit)}
				className="flex flex-col gap-3"
			>
				<div>
					<FormLabel
						title="Username"
						for="username"
						required={true}
						minLength={3}
					/>
					<div className="mt-2">
						<input
							{...register("username", {
								required: true,
								minLength: 3,
							})}
							id="username"
							name="username"
							type="text"
							required={true}
							minLength={3}
							pattern="[a-zA-Z0-9_]{3,}"
							className="leading-6 text-sm py-1 px-2 border-0 rounded-md w-full block bg-gray-800"
							aria-invalid={errors.username ? "true" : "false"}
						/>
					</div>
				</div>
				<div>
					<FormLabel
						title="Email"
						for="email"
						required={false}
						minLength={5}
					/>
					<div className="mt-2">
						<input
							{...register("email", {
								required: true,
							})}
							id="email"
							name="email"
							type="email"
							required={true}
							className="leading-6 text-sm py-1 px-2 border-0 rounded-md w-full block bg-gray-800"
							aria-invalid={errors.email ? "true" : "false"}
						/>
					</div>
				</div>
				{/* <div>
					<FormLabel title="Picture" for="picture" required={true} />
					<div className="mt-2">
						<input
							{...register("picture", {
								required: true,
							})}
							id="picture"
							name="picture"
							type="image"
							required={true}
							className="leading-6 text-sm py-1 px-2 border-0 rounded-md w-full block bg-gray-800"
							aria-invalid={errors.picture ? "true" : "false"}
						/>
					</div>
				</div> */}
				<div>
					<FormLabel
						title="Password"
						for="password"
						required={true}
						minLength={5}
					/>
					<div className="mt-2">
						<input
							{...register("password", {
								required: true,
								minLength: 5,
							})}
							id="password"
							name="password"
							type="password"
							required={true}
							minLength={5}
							className="leading-6 text-sm py-1 px-2 border-0 rounded-md w-full block bg-gray-800"
							aria-invalid={errors.email ? "true" : "false"}
						/>
					</div>
				</div>

				<div className="flex flex-row gap-2">
					<div className="flex-1">
						<button
							className="w-full leading-6 font-semibold text-sm py-1 px-3 rounded-md justify-center flex bg-gray-500 hover:bg-gray-600"
							type="submit"
						>
							Register
						</button>
					</div>
				</div>
			</form>
		</div>
	);
};

export default RegisterPage;
