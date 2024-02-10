import { useState } from "react";
import { useForm } from "react-hook-form";
import { Navigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { useSWRConfig } from "swr";

import { loggedUserAtom } from "../atom";
import { UserCreateInputs } from "../models/form";
import { apiUserUrl, userProfilePath } from "../urls";
import FormLabel from "./login_page/FormLabel";

const RegisterPage = () => {
	const setLoggedUser = useSetRecoilState(loggedUserAtom);
	const [success, setSuccess] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<UserCreateInputs>();

	const { mutate } = useSWRConfig();
	const onSubmit = async (data: UserCreateInputs) => {
		const res = await fetch(apiUserUrl, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				username: data.username,
				email: data.email,
				picture: data.picture,
				password: data.password,
			}),
		});

		mutate(apiUserUrl);

		if (res.status === 200) {
			setLoggedUser(data.username);
			setSuccess(true);
		}
	};

	return (
		<div className="flex flex-col gap-3 p-4">
			{success && <Navigate to={userProfilePath} />}

			<form
				onSubmit={handleSubmit(onSubmit)}
				className="flex flex-col gap-3"
			>
				<div>
					<FormLabel title="Username" for="username" />
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
							className="leading-6 text-sm py-1 px-2 border-0 rounded-md w-full block bg-gray-800"
							aria-invalid={errors.username ? "true" : "false"}
						/>
					</div>
				</div>
				<div>
					<FormLabel title="Email" for="email" />
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
					<FormLabel title="Picture" for="picture" />
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
					<FormLabel title="Password" for="password" />
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