import axios from "axios";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { useRef, useState } from "react";
import { Helmet } from "react-helmet";
import { useForm } from "react-hook-form";
import { Navigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { useSWRConfig } from "swr";

import { loggedUserUsernameAtom } from "../atom";
import FileUploadField from "../components/form/FileUploadField";
import InputTextField from "../components/form/InputTextField";
import Heading1 from "../components/heading/Heading1";
import { logError, logInfo } from "../logger";
import { axiosMultipartConfig } from "../models/axiosConfig";
import { UserCreateInputs } from "../models/form";
import { apiUserUrl, userProfilePath } from "../urls";

const RegisterPage = () => {
	const setLoggedUserUsername = useSetRecoilState(loggedUserUsernameAtom);
	const [success, setSuccess] = useState(false);
	const toast = useRef<Toast>(null);

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
			await axios.post(apiUserUrl, formData, axiosMultipartConfig);

			mutate(apiUserUrl);
			setLoggedUserUsername(data.username);
			setSuccess(true);
		} catch (error) {
			logError(
				RegisterPage.name,
				onSubmit.name,
				"Error submitting form",
				error,
			);

			toast.current?.show({
				severity: "error",
				summary: "Error",
				detail: "Error submitting form",
				life: 3000,
			});
		}
	};

	return (
		<div className="flex flex-col gap-3">
			<Helmet>
				<title>Register new account - Streamify</title>
			</Helmet>
			{success && <Navigate to={userProfilePath} />}

			<Toast ref={toast} />

			<div className="text-center mt-10">
				<Heading1 title="Register" />
			</div>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="flex flex-col gap-3 max-w-sm w-full mx-auto my-10"
			>
				<InputTextField
					label="*Username"
					name="username"
					type="text"
					register={register}
					errorField={errors.username}
					options={{
						required: true,
						minLength: 3,
						pattern: /[a-zA-Z0-9_]{3,}/,
					}}
				/>

				<InputTextField
					label="*Email"
					name="email"
					type="email"
					register={register}
					errorField={errors.email}
					options={{
						required: true,
					}}
				/>

				<FileUploadField
					label="Picture"
					name="picture"
					register={register}
					errorField={errors.picture}
					accept="image/*"
				/>

				<InputTextField
					label="*Password"
					name="password"
					type="password"
					register={register}
					errorField={errors.password}
					options={{
						required: true,
						minLength: 5,
					}}
				/>

				<Button label="Register" className="w-full" type="submit" />
			</form>
		</div>
	);
};

export default RegisterPage;
