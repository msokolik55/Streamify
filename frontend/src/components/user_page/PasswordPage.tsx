import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRecoilValue } from "recoil";
import { useSWRConfig } from "swr";

import { loggedUserAtom } from "../../atom";
import { PasswordEditInputs } from "../../models/form";
import { apiPasswordUrl, apiUserUrl } from "../../urls";
import FormLabel from "../login_page/FormLabel";

const PasswordPage = () => {
	const loggedUser = useRecoilValue(loggedUserAtom);
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

		const res = await fetch(apiPasswordUrl, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				username: loggedUser,
				oldPassword: data.oldPassword,
				newPassword: data.newPassword,
			}),
		});

		const resData = await res.json();

		const changeSuccess = resData.data;
		const changeError = resData.error;

		if (changeSuccess) {
			mutate(`${apiUserUrl}/${loggedUser}`);
			alert("Password successfully changed");
			setErrorMessage(undefined);
		} else setErrorMessage(changeError);
	};

	return (
		<div className="flex flex-col gap-4">
			<form
				className="flex flex-col gap-3"
				onSubmit={handleSubmit(onSubmit)}
			>
				<div>
					<FormLabel title="Old password" for="oldPassword" />
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
					<FormLabel title="New password" for="newPassword" />
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
