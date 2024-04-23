import axios from "axios";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { useRef } from "react";
import { Helmet } from "react-helmet";
import { useForm } from "react-hook-form";
import { useRecoilValue } from "recoil";
import { useSWRConfig } from "swr";

import { loggedUserUsernameAtom } from "../../atom";
import InputTextField from "../../components/form/InputTextField";
import { logError, logInfo } from "../../logger";
import { axiosJsonConfig } from "../../models/axiosConfig";
import { PasswordEditInputs } from "../../models/form";
import { apiPasswordUrl, apiUserUrl } from "../../urls";

const PasswordPage = () => {
	const loggedUserUsername = useRecoilValue(loggedUserUsernameAtom);
	const toast = useRef<Toast>(null);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<PasswordEditInputs>();

	const { mutate } = useSWRConfig();
	const onSubmit = async (data: PasswordEditInputs) => {
		if (data.newPassword !== data.confirmNewPassword) {
			return;
		}

		logInfo(PasswordPage.name, onSubmit.name, "Fetching");

		try {
			const response = await axios.put(
				apiPasswordUrl,
				{
					username: loggedUserUsername,
					oldPassword: data.oldPassword,
					newPassword: data.newPassword,
				},
				axiosJsonConfig,
			);

			const resData = response.data;

			const changeSuccess = resData.data;

			if (changeSuccess) {
				mutate(`${apiUserUrl}/${loggedUserUsername}`);
				alert("Password successfully changed");
			}
		} catch (error) {
			logError(
				PasswordPage.name,
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
		<div className="flex flex-col gap-4">
			<Helmet>
				<title>Password - Streamify</title>
			</Helmet>

			<Toast ref={toast} />

			<form
				className="flex flex-col gap-3"
				onSubmit={handleSubmit(onSubmit)}
			>
				<InputTextField
					name="oldPassword"
					label="Old password"
					type="password"
					register={register}
					errorField={errors.oldPassword}
					options={{
						required: true,
						minLength: 5,
					}}
				/>

				<InputTextField
					name="newPassword"
					label="New password"
					type="password"
					register={register}
					errorField={errors.newPassword}
					options={{
						required: true,
						minLength: 5,
					}}
				/>

				<InputTextField
					name="confirmNewPassword"
					label="Confirm new password"
					type="password"
					register={register}
					errorField={errors.confirmNewPassword}
					options={{
						required: true,
						minLength: 5,
					}}
				/>

				<Button label="Confirm" type="submit" />
			</form>
		</div>
	);
};

export default PasswordPage;
