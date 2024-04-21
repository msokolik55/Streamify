import axios from "axios";
import { Button } from "primereact/button";
import { FileUpload } from "primereact/fileupload";
import { Image } from "primereact/image";
import { InputText } from "primereact/inputtext";
import { useState } from "react";
import { Helmet } from "react-helmet";
import { useForm } from "react-hook-form";
import { Navigate, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import useSWR, { useSWRConfig } from "swr";

import { loggedUserUsernameAtom } from "../../atom";
import MainWindowError from "../../components/errors/MainWindowError";
import { logError, logInfo } from "../../logger";
import { IResponseData } from "../../models/IResponseData";
import { IUser } from "../../models/IUser";
import fetcher, { axiosConfig } from "../../models/fetcher";
import { UserEditInputs } from "../../models/form";
import { apiLiveUrl, apiUserUrl, userPath } from "../../urls";

const UserProfilePage = () => {
	const navigate = useNavigate();

	const [loggedUserUsername, setLoggedUserUsername] = useRecoilState(
		loggedUserUsernameAtom,
	);
	const [edit, setEdit] = useState(false);
	const [deleted, setDeleted] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<UserEditInputs>();

	const { mutate } = useSWRConfig();
	const onSubmit = async (data: UserEditInputs) => {
		logInfo(UserProfilePage.name, onSubmit.name, "Fetching");

		const formData = new FormData();
		formData.append("username", data.username);
		formData.append("email", data.email);
		if (data.picture && data.picture.length > 0) {
			formData.append("picture", data.picture[0]);
		}

		try {
			await axios.put(`${apiUserUrl}/${data.id}`, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});

			mutate(`${apiUserUrl}/${loggedUserUsername}`);
			mutate(apiUserUrl);
			mutate(apiLiveUrl);

			setLoggedUserUsername(data.username);
			setEdit(false);
		} catch (error) {
			logError(
				UserProfilePage.name,
				onSubmit.name,
				"Error updating user profile:",
				error,
			);
		}
	};

	const deleteAccount = async () => {
		logInfo(UserProfilePage.name, deleteAccount.name, "Fetching");

		try {
			const response = await axios.delete(
				`${apiUserUrl}/${loggedUserUsername}`,
				axiosConfig,
			);

			mutate(`${apiUserUrl}/${loggedUserUsername}`);
			mutate(apiUserUrl);
			mutate(apiLiveUrl);

			if (response.status === 204) {
				setLoggedUserUsername(undefined);
				setDeleted(true);
				navigate(userPath);
			}
		} catch (error) {
			logError(
				"UserProfilePage",
				"deleteAccount",
				"Error deleting user account:",
				error,
			);
		}
	};

	const { data, error } = useSWR<IResponseData<IUser>, Error>(
		`${apiUserUrl}/${loggedUserUsername}`,
		fetcher,
	);
	const user = data?.data;

	if (error) {
		return <MainWindowError message={error.message} />;
	}

	if (!user) {
		return (
			<MainWindowError message="Cannot find user with given username." />
		);
	}

	return (
		<div className="flex flex-col gap-3">
			<Helmet>
				<title>User Profile - Streamify</title>
			</Helmet>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="flex flex-col gap-3"
			>
				<input
					{...register("id", {
						required: true,
					})}
					id="id"
					name="id"
					type="hidden"
					required={true}
					defaultValue={user.id}
				/>

				<div className="flex flex-col gap-2">
					<label htmlFor="username">Username</label>
					<InputText
						{...register("username", {
							required: true,
							minLength: 3,
						})}
						id="username"
						name="username"
						type="text"
						required={true}
						minLength={3}
						aria-invalid={errors.username ? "true" : "false"}
						defaultValue={user.username}
						disabled={!edit}
					/>
				</div>

				<div className="flex flex-col gap-2">
					<label htmlFor="email">Email</label>
					<InputText
						{...register("email", {
							required: true,
						})}
						id="email"
						name="email"
						type="email"
						required={true}
						aria-invalid={errors.email ? "true" : "false"}
						defaultValue={user.email}
						disabled={!edit}
					/>
				</div>
				<div className="flex flex-col gap-2">
					<label htmlFor="picture">Picture</label>
					{user.picture && (
						<Image
							src={user.picture}
							alt="Profile picture"
							imageClassName="w-24"
						/>
					)}
					<FileUpload
						{...register("picture")}
						mode="basic"
						id="picture"
						name="picture"
						accept="image/*"
						aria-invalid={errors.picture ? "true" : "false"}
						disabled={!edit}
					/>
				</div>

				{edit && (
					<div className="flex flex-row gap-2">
						<Button
							label="Cancel"
							className="flex-1"
							onClick={() => setEdit(false)}
						/>
						<Button
							label="Confirm"
							className="flex-1"
							type="submit"
						/>
					</div>
				)}
			</form>
			{!edit && (
				<div className="flex flex-col gap-2 text-center">
					<Button label="Edit" onClick={() => setEdit(true)} />
					<Button label="Delete account" onClick={deleteAccount} />
					{deleted && <Navigate to={userPath} />}
				</div>
			)}
		</div>
	);
};

export default UserProfilePage;
