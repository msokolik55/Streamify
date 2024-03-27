import { useState } from "react";
import { useForm } from "react-hook-form";
import { Navigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import useSWR, { useSWRConfig } from "swr";

import { loggedUserIdAtom } from "../../atom";
import { logInfo } from "../../logger";
import { IDataUser } from "../../models/IDataUser";
import fetcher from "../../models/fetcher";
import { UserEditInputs } from "../../models/form";
import { apiLiveUrl, apiUserUrl, userPath } from "../../urls";
import MainWindowError from "../errors/MainWindowError";
import FormLabel from "../login_page/FormLabel";

const UserProfilePage = () => {
	const [loggedUserId, setLoggedUserId] = useRecoilState(loggedUserIdAtom);
	const [edit, setEdit] = useState(false);
	const [deleted, setDeleted] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<UserEditInputs>();

	const { mutate } = useSWRConfig();
	const onSubmit = async (data: UserEditInputs) => {
		logInfo("Fetching: UserProfilePage.onSubmit");

		const res = await fetch(`${apiUserUrl}/${data.id}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				username: data.username,
				email: data.email,
				picture: data.picture,
			}),
		});

		mutate(`${apiUserUrl}/${loggedUserId}`);
		mutate(apiUserUrl);
		mutate(apiLiveUrl);

		if (res.status === 200) setLoggedUserId(data.username);
		setEdit(false);
	};

	const deleteAccount = async () => {
		logInfo("Fetching: UserProfilePage.deleteAccount");

		const res = await fetch(`${apiUserUrl}/${loggedUserId}`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
			},
		});

		mutate(`${apiUserUrl}/${loggedUserId}`);
		mutate(apiUserUrl);
		mutate(apiLiveUrl);

		if (res.status === 200) {
			setLoggedUserId(undefined);
			setDeleted(true);
		}
	};

	const { data, error } = useSWR<IDataUser, Error>(
		`${apiUserUrl}/${loggedUserId}`,
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
				{/* <div>
					<FormLabel title="Picture" for="picture" required={true} />
					<div className="mt-2">
						<input
							{...register("picture", {
								required: true,
							})}
							id="picture"
							name="picture"
							type="image"
							required={true}
							className={`leading-6 text-sm py-1 px-2 border-0 rounded-md w-full block bg-gray-800 ${edit ? "" : "text-gray-400"}`}
							aria-invalid={errors.picture ? "true" : "false"}
							defaultValue={user.picture}
							disabled={true}
						/>
					</div>
				</div> */}

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
