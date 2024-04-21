import axios from "axios";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { TabPanel, TabView } from "primereact/tabview";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRecoilValue } from "recoil";
import useSWR, { useSWRConfig } from "swr";

import { loggedUserUsernameAtom } from "../../atom";
import VideoPlayer from "../../components/VideoPlayer";
import MainWindowError from "../../components/errors/MainWindowError";
import { getActualStream } from "../../components/streamHelpers";
import MessagesPanel from "../../components/user_page/MessagesPanel";
import { logError, logInfo } from "../../logger";
import { IResponseData } from "../../models/IResponseData";
import { IUser } from "../../models/IUser";
import fetcher, { axiosConfig } from "../../models/fetcher";
import { FormState, StreamKeyInputs } from "../../models/form";
import { apiLiveUrl, apiStreamUrl, apiUserUrl } from "../../urls";

const UserStreamPage = () => {
	const loggedUserUsername = useRecoilValue(loggedUserUsernameAtom);

	const { data, error } = useSWR<IResponseData<IUser>, Error>(
		`${apiUserUrl}/${loggedUserUsername}`,
		fetcher,
	);
	const user = data?.data;
	const [formState, setFormState] = useState(
		!user?.streamKey ? FormState.CREATE : FormState.UPDATE,
	);

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<StreamKeyInputs>();

	if (error) {
		return <MainWindowError message={error.message} />;
	}

	if (!user) {
		return (
			<MainWindowError message="Cannot find user with given username." />
		);
	}

	const { mutate } = useSWRConfig();

	const setUserLive = async (live: boolean) => {
		logInfo(UserStreamPage.name, setUserLive.name, "Fetching");

		try {
			await axios.patch(
				`${apiLiveUrl}/${user.id}`,
				{
					live,
				},
				axiosConfig,
			);
		} catch (error) {
			logError(
				UserStreamPage.name,
				setUserLive.name,
				"Error setting user live:",
				error,
			);
		}
	};

	//#region Before Submit

	const upsertStream = async (inputs: StreamKeyInputs) => {
		logInfo(UserStreamPage.name, upsertStream.name, "Fetching");

		try {
			await axios.post(
				apiStreamUrl,
				{
					...inputs,
					username: user.username,
				},
				axiosConfig,
			);
		} catch (error) {
			logError(
				UserStreamPage.name,
				upsertStream.name,
				"Error creating stream:",
				error,
			);
		}
	};

	//#endregion Before Submit

	//#region After Submit

	const copyStreamKey = () => {
		navigator.clipboard.writeText(user.streamKey ?? "");
		window.alert("Stream key copied to clipboard.");
	};

	const streamExists = async () => {
		logInfo(UserStreamPage.name, streamExists.name, "Fetching");

		try {
			const sourceExistsRes = await axios.get(
				`${apiStreamUrl}/${user.streamKey}/exists`,
				axiosConfig,
			);

			const sourceExists = sourceExistsRes.data;
			return sourceExists.data;
		} catch (error) {
			logError(
				UserStreamPage.name,
				streamExists.name,
				"Error checking if stream exists:",
				error,
			);
		}
	};

	const deleteStream = async () => {
		logInfo(UserStreamPage.name, deleteStream.name, "Fetching");

		try {
			await axios.delete(
				`${apiStreamUrl}/${user.streamKey}`,
				axiosConfig,
			);

			mutate(`${apiUserUrl}/${loggedUserUsername}`);
		} catch (error) {
			logError(
				UserStreamPage.name,
				deleteStream.name,
				"Error deleting stream:",
				error,
			);
		}
	};

	const endStream = async () => {
		logInfo(UserStreamPage.name, endStream.name, "Fetching");

		try {
			await axios.put(
				`${apiStreamUrl}/${user.streamKey}/end`,
				{},
				axiosConfig,
			);

			mutate(`${apiUserUrl}/${loggedUserUsername}`);
		} catch (error) {
			logError(
				UserStreamPage.name,
				endStream.name,
				"Error ending stream:",
				error,
			);
		}
	};

	//#endregion After Submit

	const onSubmit = async (data: StreamKeyInputs) => {
		if (!user.streamKey) {
			await setUserLive(true);
			setFormState(FormState.UPDATE);
		}
		await upsertStream(data);

		mutate(`${apiUserUrl}?live=true`);
		mutate(`${apiUserUrl}/${loggedUserUsername}`);
	};

	useEffect(() => {
		const end = async () => {
			await setUserLive(false);
			reset();

			const streamSourceExists = await streamExists();
			if (!streamSourceExists) await deleteStream();
			else await endStream();
		};
		if (formState === FormState.END) {
			end();
			setFormState(FormState.CREATE);
		}
	}, [formState]);

	const submitted = formState === FormState.UPDATE && user.streamKey;
	const stream = getActualStream(user);

	return (
		<div className="flex flex-col gap-4">
			<TabView>
				{formState !== FormState.CREATE && (
					<TabPanel header="Info" className="flex flex-col gap-4">
						<div className="flex flex-row gap-2 justify-between items-center">
							<span>{user.streamKey}</span>
							<Button label="Copy" onClick={copyStreamKey} />
						</div>

						{formState === FormState.UPDATE && (
							<div className="flex">
								<Button
									label="End stream"
									className="flex-1"
									onClick={() => setFormState(FormState.END)}
								/>
							</div>
						)}
					</TabPanel>
				)}
				<TabPanel header="Edit">
					<form
						className="flex flex-col gap-3"
						onSubmit={handleSubmit(onSubmit)}
					>
						<div className="mx-4 flex flex-col gap-3">
							<label htmlFor="name">Stream name</label>
							<InputText
								{...register("name", {
									required: true,
									minLength: 3,
								})}
								id="name"
								name="name"
								type="text"
								required={true}
								minLength={3}
								aria-invalid={errors.name ? "true" : "false"}
								// disabled={submitted}
								defaultValue={submitted ? stream.name : ""}
							/>
							<label htmlFor="description">Description</label>
							<InputTextarea
								{...register("description")}
								id="description"
								name="description"
								aria-invalid={
									errors.description ? "true" : "false"
								}
								// disabled={submitted}
								defaultValue={
									submitted ? stream.description : ""
								}
							/>
							<Button
								label={
									formState === FormState.CREATE
										? "Start stream"
										: "Edit stream"
								}
								type="submit"
							/>
						</div>
					</form>
				</TabPanel>

				{submitted && (
					<TabPanel header="Messages">
						<MessagesPanel
							messages={stream.messages}
							loggedUsername={loggedUserUsername ?? ""}
							streamKey={user.streamKey ?? ""}
						/>
					</TabPanel>
				)}

				{submitted && (
					<TabPanel header="Preview">
						<VideoPlayer streamKey={user.streamKey ?? ""} />
					</TabPanel>
				)}
			</TabView>
		</div>
	);
};

export default UserStreamPage;
