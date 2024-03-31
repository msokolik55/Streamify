import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRecoilValue } from "recoil";
import { useSWRConfig } from "swr";

import { loggedUserUsernameAtom } from "../../atom";
import { logError, logInfo } from "../../logger";
import { axiosConfig } from "../../models/fetcher";
import { PasswordEditInputs } from "../../models/form";
import { apiPasswordUrl, apiUserUrl } from "../../urls";
import FormLabel from "../login_page/FormLabel";

const PasswordPage = () => {
	const loggedUserUsername = useRecoilValue(loggedUserUsernameAtom);
	const [errorMessage, setErrorMessage] = useState<string | undefined>();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<PasswordEditInputs>();

	const { mutate } = useSWRConfig();
	const onSubmit = async (data: PasswordEditInputs) => {
		if (data.newPassword !== data.confirmNewPassword) {
			setErrorMessage("Different value in Confirm new password.");
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
			const changeError = resData.error;

			if (changeSuccess) {
				mutate(`${apiUserUrl}/${loggedUserUsername}`);
				alert("Password successfully changed");
				setErrorMessage(undefined);
			} else {
				setErrorMessage(changeError);
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
			<form
				className="flex flex-col gap-3"
				onSubmit={handleSubmit(onSubmit)}
			>
				<div>
					<FormLabel
						title="Old password"
						for="oldPassword"
						required={true}
						minLength={5}
					/>
					<div className="mt-2">
						<input
							{...register("oldPassword", {
								required: true,
								minLength: 5,
							})}
							id="oldPassword"
							name="oldPassword"
							type="password"
							required={true}
							minLength={5}
							className="leading-6 text-sm py-1 px-2 border-0 rounded-md w-full block bg-gray-800"
							aria-invalid={errors.oldPassword ? "true" : "false"}
						/>
					</div>
				</div>
				<div>
					<FormLabel
						title="New password"
						for="newPassword"
						required={true}
						minLength={5}
					/>
					<div className="mt-2">
						<input
							{...register("newPassword", {
								required: true,
								minLength: 5,
							})}
							id="newPassword"
							name="newPassword"
							type="password"
							required={true}
							minLength={5}
							className="leading-6 text-sm py-1 px-2 border-0 rounded-md w-full block bg-gray-800"
							aria-invalid={errors.newPassword ? "true" : "false"}
						/>
					</div>
				</div>
				<div>
					<FormLabel
						title="Confirm new password"
						for="confirmNewPassword"
						required={true}
						minLength={5}
					/>
					<div className="mt-2">
						<input
							{...register("confirmNewPassword", {
								required: true,
								minLength: 5,
							})}
							id="confirmNewPassword"
							name="confirmNewPassword"
							type="password"
							required={true}
							minLength={5}
							className="leading-6 text-sm py-1 px-2 border-0 rounded-md w-full block bg-gray-800"
							aria-invalid={
								errors.confirmNewPassword ? "true" : "false"
							}
						/>
					</div>
				</div>

				<div className="text-sm text-red-500">{errorMessage}</div>

				<button
					className="leading-6 font-semibold text-sm py-1 px-3 rounded-md justify-center flex bg-gray-500 hover:bg-gray-600"
					type="submit"
				>
					Confirm
				</button>
			</form>
		</div>
	);
};

export default PasswordPage;
