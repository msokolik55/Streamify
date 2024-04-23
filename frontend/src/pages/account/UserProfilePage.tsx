import axios from "axios";
import { Button } from "primereact/button";
import { ConfirmPopup, confirmPopup } from "primereact/confirmpopup";
import { Image } from "primereact/image";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { useRef, useState } from "react";
import { Helmet } from "react-helmet";
import { useForm } from "react-hook-form";
import { Navigate, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { useSWRConfig } from "swr";

import { loggedUserUsernameAtom } from "../../atom";
import ErrorBlock from "../../components/error/ErrorBlock";
import FileUploadField from "../../components/form/FileUploadField";
import InputTextField from "../../components/form/InputTextField";
import { useLoggedUser } from "../../functions/useFetch";
import { logError, logInfo } from "../../logger";
import {
	axiosJsonConfig,
	axiosMultipartConfig,
} from "../../models/axiosConfig";
import { UserEditInputs } from "../../models/form";
import { apiLiveUrl, apiUserUrl, userPath } from "../../urls";

const UserProfilePage = () => {
	const navigate = useNavigate();

	const [loggedUserUsername, setLoggedUserUsername] = useRecoilState(
		loggedUserUsernameAtom,
	);
	const [edit, setEdit] = useState(false);
	const [deleted, setDeleted] = useState(false);
	const toast = useRef<Toast>(null);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<UserEditInputs>();
	const { data: user, error } = useLoggedUser();

	if (error) {
		return <ErrorBlock error={error} />;
	}

	if (!user) {
		return (
			<ErrorBlock
				error={new Error("Cannot find user with given username.")}
			/>
		);
	}

	const { mutate } = useSWRConfig();
	const mutateUser = () => {
		mutate(`${apiUserUrl}/${loggedUserUsername}`);
		mutate(apiUserUrl);
		mutate(apiLiveUrl);
	};

	const onSubmit = async (data: UserEditInputs) => {
		logInfo(UserProfilePage.name, onSubmit.name, "Fetching");

		const formData = new FormData();
		formData.append("username", data.username);
		formData.append("email", data.email);
		if (data.picture && data.picture.length > 0) {
			formData.append("picture", data.picture[0]);
		}

		try {
			await axios.put(
				`${apiUserUrl}/${data.id}`,
				formData,
				axiosMultipartConfig,
			);

			mutateUser();

			setLoggedUserUsername(data.username);
			setEdit(false);
		} catch (error) {
			logError(
				UserProfilePage.name,
				onSubmit.name,
				"Error updating user profile",
				error,
			);

			toast.current?.show({
				severity: "error",
				summary: "Error",
				detail: "Error updating user profile",
				life: 3000,
			});
		}
	};

	const deleteAccount = async () => {
		logInfo(UserProfilePage.name, deleteAccount.name, "Fetching");

		try {
			const response = await axios.delete(
				`${apiUserUrl}/${loggedUserUsername}`,
				axiosJsonConfig,
			);

			mutateUser();

			if (response.status === 204) {
				setLoggedUserUsername(undefined);
				setDeleted(true);
				navigate(userPath);
			}
		} catch (error) {
			logError(
				"UserProfilePage",
				"deleteAccount",
				"Error deleting user account",
				error,
			);

			toast.current?.show({
				severity: "error",
				summary: "Error",
				detail: "Error deleting user account",
				life: 3000,
			});
		}
	};

	const promptDelete = (e: any) => {
		confirmPopup({
			target: e.currentTarget,
			message: "Do you want to delete your account?",
			icon: "pi pi-trash",
			defaultFocus: "reject",
			acceptClassName: "p-button-danger",
			accept: () => deleteAccount(),
		});
	};

	return (
		<div className="flex flex-col gap-3">
			<Helmet>
				<title>User Profile - Streamify</title>
			</Helmet>

			<Toast ref={toast} />

			<form
				className="flex flex-col gap-3"
				onSubmit={handleSubmit(onSubmit)}
			>
				<InputText
					{...register("id", {
						required: true,
					})}
					id="id"
					name="id"
					type="hidden"
					required={true}
					defaultValue={user.id}
				/>

				<InputTextField
					label="*Username"
					name="username"
					type="text"
					register={register}
					errorField={errors.username}
					options={{
						required: true,
						minLength: 3,
					}}
					defaultValue={user.username}
					disabled={!edit}
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
					defaultValue={user.email}
					disabled={!edit}
				/>

				<FileUploadField
					label="Profile picture"
					name="picture"
					register={register}
					errorField={errors.picture}
					accept="image/*"
					disabled={!edit}
				/>
				{user.picture && (
					<Image
						src={user.picture}
						alt="Profile picture"
						imageClassName="w-24"
					/>
				)}

				{edit && (
					<div className="flex flex-row gap-2">
						<Button
							label="Confirm"
							className="flex-1 p-button-success"
							type="submit"
						/>
						<Button
							label="Cancel"
							className="flex-1 p-button-secondary"
							onClick={() => setEdit(false)}
						/>
					</div>
				)}
			</form>
			{!edit && (
				<div className="flex flex-row gap-2 text-center">
					<Button
						label="Edit"
						className="p-button-warning flex-1"
						onClick={() => setEdit(true)}
					/>
					<Button
						label="Delete account"
						className="p-button-danger flex-1"
						onClick={promptDelete}
					/>
					<ConfirmPopup />
					{deleted && <Navigate to={userPath} />}
				</div>
			)}
		</div>
	);
};

export default UserProfilePage;
