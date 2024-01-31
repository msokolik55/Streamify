import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import useSWR, { useSWRConfig } from "swr";

import { IDataUser } from "../../../models/IDataUser";
import fetcher from "../../../models/fetcher";
import { userId } from "../../../store/user";
import { apiUserUrl } from "../../../urls";
import { ProfileNavigation } from "./ProfileNavigation";

interface IFormInput {
	name: string;
	email: string;
}

export const ProfilePage = () => {
	const [disabledForm, setDisabledForm] = useState<boolean>(true);
	const pageUrl = apiUserUrl;

	const { mutate } = useSWRConfig();
	const { data, error } = useSWR<IDataUser>(`${pageUrl}${userId}`, fetcher);
	const user = data?.data;

	const { register, handleSubmit } = useForm<IFormInput>();
	const onSubmit: SubmitHandler<IFormInput> = async (newData) => {
		await fetch(pageUrl, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				id: user?.id,
				...newData,
			}),
		});

		setDisabledForm(!disabledForm);
		mutate(`${pageUrl}${userId}`);
		mutate("http://localhost:4000/message/");
	};

	return (
		<>
			<ProfileNavigation />

			<main className="main-window main-settings">
				<h1 className="main-settings__heading heading heading--1">
					My account
				</h1>
				<div className="main-settings__content">
					<div className="profile-editor">
						<div className="profile-editor__banner"></div>
						<div className="profile-editor__controls">
							<div className="profile-editor__profile profile-info">
								<div className="profile-editor__profile-picture profile-picture">
									<img
										src={user?.picture}
										alt="X's profile picture"
										className="profile-editor__pfp-image profile-picture__image img"
									/>
								</div>
								<div className="profile-info__account-info">
									<h2 className="profile-info__name heading heading--2">
										{user?.username}
									</h2>
									<span className="profile-info__slug">
										#0178
									</span>
								</div>
								<button
									className={`profile-info__allow-edit button ${
										!disabledForm &&
										"profile-editor__submit--disabled"
									}`}
									onClick={() =>
										setDisabledForm(!disabledForm)
									}
									disabled={!disabledForm}
								>
									Edit profile
								</button>
							</div>

							<form
								className="profile-editor__form"
								onSubmit={handleSubmit(onSubmit)}
							>
								<label
									className="profile-editor__label label"
									htmlFor="username-disabled"
								>
									Username
								</label>

								<input
									type="text"
									className="profile-editor__input"
									id="username-disabled"
									placeholder="Current username: X"
									disabled={disabledForm}
									defaultValue={user?.username}
									{...register("name", {
										required: true,
										minLength: 2,
									})}
									required={true}
									minLength={2}
								/>

								<label
									className="profile-editor__label label"
									htmlFor="email"
								>
									Email
								</label>
								<input
									type="email"
									className="profile-editor__input"
									id="email"
									placeholder="Current email: X"
									disabled={disabledForm}
									defaultValue={user?.email}
									{...register("email", {
										required: true,
										pattern:
											/[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+/,
									})}
									required={true}
									pattern="[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+"
								/>

								<input
									type="submit"
									className={`profile-editor__submit button ${
										disabledForm &&
										"profile-editor__submit--disabled"
									}`}
									value="Change profile info"
									disabled={disabledForm}
								/>
							</form>
						</div>
					</div>
				</div>
			</main>
		</>
	);
};
