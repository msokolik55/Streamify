import axios from "axios";
import { useState } from "react";
import { Helmet } from "react-helmet";
import { useForm } from "react-hook-form";
import { Navigate, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import useSWR, { useSWRConfig } from "swr";

import { loggedUserUsernameAtom } from "../../atom";
import { logError, logInfo } from "../../logger";
import { IResponseData } from "../../models/IResponseData";
import { IUser } from "../../models/IUser";
import fetcher, { axiosConfig } from "../../models/fetcher";
import { UserEditInputs } from "../../models/form";
import { apiLiveUrl, apiUserUrl, userPath } from "../../urls";
import MainWindowError from "../errors/MainWindowError";
import FormLabel from "../login_page/FormLabel";

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
				<div>
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
							className={`leading-6 text-sm py-1 px-2 border-0 rounded-md w-full block bg-gray-800 ${edit ? "" : "text-gray-400"}`}
							aria-invalid={errors.username ? "true" : "false"}
							defaultValue={user.username}
							disabled={!edit}
						/>
					</div>
				</div>
				<div>
					<FormLabel title="Email" for="email" required={true} />
					<div className="mt-2">
						<input
							{...register("email", {
								required: true,
							})}
							id="email"
							name="email"
							type="email"
							required={true}
							className={`leading-6 text-sm py-1 px-2 border-0 rounded-md w-full block bg-gray-800 ${edit ? "" : "text-gray-400"}`}
							aria-invalid={errors.email ? "true" : "false"}
							defaultValue={user.email}
							disabled={!edit}
						/>
					</div>
				</div>
				<div>
					<FormLabel title="Picture" for="picture" required={false} />
					{user.picture && (
						<img
							src={`/uploads/${user.picture}`}
							alt="Profile picture"
							className="w-24"
						/>
					)}
					<div className="mt-2">
						<input
							{...register("picture")}
							id="picture"
							name="picture"
							type="file"
							accept="image/jpeg,image/png,image/gif"
							className={`leading-6 text-sm py-1 px-2 border-0 rounded-md w-full block bg-gray-800 ${edit ? "" : "text-gray-400"}`}
							aria-invalid={errors.picture ? "true" : "false"}
							disabled={!edit}
						/>
					</div>
				</div>

				{edit && (
					<div className="flex flex-row gap-2">
						<div className="flex-1">
							<button
								onClick={() => setEdit(false)}
								className="w-full leading-6 font-semibold text-sm py-1 px-3 rounded-md justify-center flex bg-gray-500 hover:bg-gray-600"
							>
								Cancel
							</button>
						</div>
						<div className="flex-1">
							<button
								className="w-full leading-6 font-semibold text-sm py-1 px-3 rounded-md justify-center flex bg-gray-500 hover:bg-gray-600"
								type="submit"
							>
								Confirm
							</button>
						</div>
					</div>
				)}
			</form>
			{!edit && (
				<div className="flex flex-col gap-2">
					<button
						className="w-full leading-6 font-semibold text-sm py-1 px-3 rounded-md justify-center flex bg-gray-500 hover:bg-gray-600"
						onClick={() => setEdit(true)}
					>
						Edit
					</button>
					<button
						onClick={deleteAccount}
						className="w-full leading-6 font-semibold text-sm py-1 px-3 rounded-md justify-center flex bg-gray-500 hover:bg-gray-600 mt-8"
					>
						Delete account
					</button>
					{deleted && <Navigate to={userPath} />}
				</div>
			)}
		</div>
	);
};

export default UserProfilePage;
