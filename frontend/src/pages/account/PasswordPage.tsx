import axios from "axios";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
// import { useState } from "react";
import { Helmet } from "react-helmet";
import { useForm } from "react-hook-form";
import { useRecoilValue } from "recoil";
import { useSWRConfig } from "swr";

import { loggedUserUsernameAtom } from "../../atom";
import { logError, logInfo } from "../../logger";
import { axiosConfig } from "../../models/fetcher";
import { PasswordEditInputs } from "../../models/form";
import { apiPasswordUrl, apiUserUrl } from "../../urls";

const PasswordPage = () => {
	const loggedUserUsername = useRecoilValue(loggedUserUsernameAtom);
	// const [errorMessage, setErrorMessage] = useState<string | undefined>();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<PasswordEditInputs>();

	const { mutate } = useSWRConfig();
	const onSubmit = async (data: PasswordEditInputs) => {
		if (data.newPassword !== data.confirmNewPassword) {
			// setErrorMessage("Different value in Confirm new password.");
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
				axiosConfig,
			);

			const resData = response.data;

			const changeSuccess = resData.data;
			// const changeError = resData.error;

			if (changeSuccess) {
				mutate(`${apiUserUrl}/${loggedUserUsername}`);
				alert("Password successfully changed");
				// setErrorMessage(undefined);
			} else {
				// setErrorMessage(changeError);
			}
		} catch (error) {
			logError(
				PasswordPage.name,
				onSubmit.name,
				"Error submitting form:",
				error,
			);
		}
	};

	return (
		<div className="flex flex-col gap-4">
			<Helmet>
				<title>Password - Streamify</title>
			</Helmet>
			<form
				className="flex flex-col gap-3"
				onSubmit={handleSubmit(onSubmit)}
			>
				<div className="flex flex-col gap-2">
					<label htmlFor="oldPassword">*Old password</label>
					<InputText
						{...register("oldPassword", {
							required: true,
							minLength: 5,
						})}
						id="oldPassword"
						name="oldPassword"
						type="password"
						required={true}
						minLength={5}
						aria-invalid={errors.oldPassword ? "true" : "false"}
					/>
				</div>
				<div className="flex flex-col gap-2">
					<label htmlFor="newPassword">*New password</label>
					<InputText
						{...register("newPassword", {
							required: true,
							minLength: 5,
						})}
						id="newPassword"
						name="newPassword"
						type="password"
						required={true}
						minLength={5}
						aria-invalid={errors.newPassword ? "true" : "false"}
					/>
				</div>
				<div className="flex flex-col gap-2">
					<label htmlFor="confirmNewPassword">
						*Confirm new password
					</label>
					<InputText
						{...register("confirmNewPassword", {
							required: true,
							minLength: 5,
						})}
						id="confirmNewPassword"
						name="confirmNewPassword"
						type="password"
						required={true}
						minLength={5}
						aria-invalid={
							errors.confirmNewPassword ? "true" : "false"
						}
					/>
				</div>

				<Button label="Confirm" type="submit" />
			</form>
		</div>
	);
};

export default PasswordPage;
