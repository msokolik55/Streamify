import axios from "axios";
import { Button } from "primereact/button";
import { FileUpload } from "primereact/fileupload";
import { InputText } from "primereact/inputtext";
import { Message } from "primereact/message";
import { useState } from "react";
import { Helmet } from "react-helmet";
import { useForm } from "react-hook-form";
import { Navigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { useSWRConfig } from "swr";

import { loggedUserUsernameAtom } from "../atom";
import Heading1 from "../components/Heading1";
import { logError, logInfo } from "../logger";
import { UserCreateInputs } from "../models/form";
import { apiUserUrl, userProfilePath } from "../urls";

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

		const formData = new FormData();
		formData.append("username", data.username);
		formData.append("email", data.email);
		if (data.picture && data.picture.length > 0) {
			formData.append("picture", data.picture[0]);
		}
		formData.append("password", data.password);

		try {
			await axios.post(apiUserUrl, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});

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
		<div className="flex flex-col gap-3">
			<Helmet>
				<title>Register new account - Streamify</title>
			</Helmet>
			{success && <Navigate to={userProfilePath} />}

			<div className="text-center mt-10">
				<Heading1 title="Register" />
			</div>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="flex flex-col gap-3 max-w-sm w-full mx-auto my-10"
			>
				<div className="flex flex-col gap-2">
					<label htmlFor="username">*Username</label>
					<InputText
						{...register("username", {
							required: true,
							minLength: 3,
							pattern: /[a-zA-Z0-9_]{3,}/,
						})}
						id="username"
						name="username"
						type="text"
						required={true}
						minLength={3}
						pattern="[a-zA-Z0-9_]{3,}"
						aria-invalid={errors.username ? "true" : "false"}
					/>
					{errors.username &&
						errors.username.type === "minLength" && (
							<Message severity="error" text="Min. length: 3" />
						)}
				</div>
				<div className="flex flex-col gap-2">
					<label htmlFor="email">*Email</label>
					<InputText
						{...register("email", {
							required: true,
						})}
						id="email"
						name="email"
						type="email"
						required={true}
						aria-invalid={errors.email ? "true" : "false"}
					/>
				</div>
				<div className="flex flex-col gap-2">
					<label htmlFor="picture">Picture</label>
					<FileUpload
						{...register("picture")}
						mode="basic"
						id="picture"
						name="picture"
						accept="image/*"
						aria-invalid={errors.picture ? "true" : "false"}
					/>
				</div>
				<div className="flex flex-col gap-2">
					<label htmlFor="password">*Password</label>
					<InputText
						{...register("password", {
							required: true,
							minLength: 5,
						})}
						id="password"
						name="password"
						type="password"
						required={true}
						minLength={5}
						aria-invalid={errors.email ? "true" : "false"}
					/>
					{errors.password &&
						errors.password.type === "minLength" && (
							<Message severity="error" text="Min. length: 5" />
						)}
				</div>

				<Button label="Register" className="w-full" type="submit" />
			</form>
		</div>
	);
};

export default RegisterPage;
