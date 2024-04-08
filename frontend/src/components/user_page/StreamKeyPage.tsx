import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRecoilValue } from "recoil";
import useSWR, { useSWRConfig } from "swr";

import { loggedUserUsernameAtom } from "../../atom";
import { logError, logInfo } from "../../logger";
import { IResponseData } from "../../models/IResponseData";
import { IUser } from "../../models/IUser";
import fetcher, { axiosConfig } from "../../models/fetcher";
import { FormState, StreamKeyInputs } from "../../models/form";
import {
	apiLiveUrl,
	apiMessageUrl,
	apiStreamUrl,
	apiUserUrl,
	messagePath,
} from "../../urls";
import VideoPlayer from "../VideoPlayer";
import MainWindowError from "../errors/MainWindowError";
import FormLabel from "../login_page/FormLabel";
import { getActualStream } from "../streamHelpers";

const StreamKeyPage = () => {
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
		logInfo(StreamKeyPage.name, setUserLive.name, "Fetching");

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
				StreamKeyPage.name,
				setUserLive.name,
				"Error setting user live:",
				error,
			);
		}
	};

	//#region Before Submit

	const upsertStream = async (inputs: StreamKeyInputs) => {
		logInfo(StreamKeyPage.name, upsertStream.name, "Fetching");

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
				StreamKeyPage.name,
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
		logInfo(StreamKeyPage.name, streamExists.name, "Fetching");

		try {
			const sourceExistsRes = await axios.get(
				`${apiStreamUrl}/${user.streamKey}/exists`,
				axiosConfig,
			);

			const sourceExists = sourceExistsRes.data;
			return sourceExists.data;
		} catch (error) {
			logError(
				StreamKeyPage.name,
				streamExists.name,
				"Error checking if stream exists:",
				error,
			);
		}
	};

	const deleteStream = async () => {
		logInfo(StreamKeyPage.name, deleteStream.name, "Fetching");

		try {
			await axios.delete(
				`${apiStreamUrl}/${user.streamKey}`,
				axiosConfig,
			);

			mutate(`${apiUserUrl}/${loggedUserUsername}`);
		} catch (error) {
			logError(
				StreamKeyPage.name,
				deleteStream.name,
				"Error deleting stream:",
				error,
			);
		}
	};

	const endStream = async () => {
		logInfo(StreamKeyPage.name, endStream.name, "Fetching");

		try {
			await axios.put(
				`${apiStreamUrl}/${user.streamKey}/end`,
				{},
				axiosConfig,
			);

			mutate(`${apiUserUrl}/${loggedUserUsername}`);
		} catch (error) {
			logError(
				StreamKeyPage.name,
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

	//#region Messages

	const deleteMessage = async (messageId: string) => {
		logInfo(StreamKeyPage.name, deleteMessage.name, "Fetching");

		try {
			await axios.delete(`${apiMessageUrl}/${messageId}`, axiosConfig);

			mutate(`${apiUserUrl}/${loggedUserUsername}`);
			mutate(`${apiStreamUrl}/${user.streamKey}${messagePath}`);
		} catch (error) {
			logError(
				StreamKeyPage.name,
				deleteMessage.name,
				"Error deleting message",
				error,
			);
		}
	};

	const answerMessage = async (messageId: string, answered: boolean) => {
		logInfo(StreamKeyPage.name, answerMessage.name, "Fetching");

		try {
			await axios.patch(
				`${apiMessageUrl}/${messageId}`,
				{
					answered: !answered,
				},
				axiosConfig,
			);

			mutate(`${apiUserUrl}/${loggedUserUsername}`);
			mutate(`${apiStreamUrl}/${user.streamKey}${messagePath}`);
		} catch (error) {
			logError(
				StreamKeyPage.name,
				answerMessage.name,
				"Error answering message",
				error,
			);
		}
	};

	//#endregion Messages

	const submitted = formState === FormState.UPDATE && user.streamKey;
	const stream = getActualStream(user);

	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-col gap-3">
				{formState !== FormState.CREATE && (
					<>
						<FormLabel
							title="Stream key"
							for="streamKey"
							required={false}
							minLength={0}
						/>
						<div className="flex flex-row gap-2 justify-between">
							<span>{user.streamKey}</span>
							<button
								className="leading-6 font-semibold text-sm py-1 px-3 rounded-md justify-center flex bg-gray-500 hover:bg-gray-600"
								onClick={copyStreamKey}
							>
								Copy
							</button>
						</div>
					</>
				)}
				<form
					className="flex flex-col gap-3"
					onSubmit={handleSubmit(onSubmit)}
				>
					<h1 className="text-lg font-semibold">Stream Form</h1>
					<div className="mx-4 flex flex-col gap-3">
						<FormLabel
							title="Stream name"
							for="name"
							required={true}
							minLength={3}
						/>
						<input
							{...register("name", {
								required: true,
								minLength: 3,
							})}
							id="name"
							name="name"
							type="text"
							required={true}
							minLength={3}
							className="leading-6 text-sm py-1 px-2 border-0 rounded-md w-full block bg-gray-800"
							aria-invalid={errors.name ? "true" : "false"}
							// disabled={submitted}
							defaultValue={submitted ? stream.name : ""}
						/>
						<FormLabel
							title="Description"
							for="description"
							required={false}
							minLength={0}
						/>
						<textarea
							{...register("description")}
							id="description"
							name="description"
							className="leading-6 text-sm py-1 px-2 border-0 rounded-md w-full block bg-gray-800"
							aria-invalid={errors.description ? "true" : "false"}
							// disabled={submitted}
							defaultValue={submitted ? stream.description : ""}
						/>
						<button
							className="leading-6 font-semibold text-sm py-1 px-3 rounded-md justify-center flex bg-gray-500 hover:bg-gray-600"
							type="submit"
						>
							{formState === FormState.CREATE
								? "Start stream"
								: "Edit stream"}
						</button>
						{formState === FormState.UPDATE && (
							<button
								className="leading-6 font-semibold text-sm py-1 px-3 rounded-md justify-center flex bg-gray-500 hover:bg-gray-600"
								onClick={() => setFormState(FormState.END)}
							>
								End stream
							</button>
						)}
					</div>
				</form>

				{submitted && (
					<>
						<h1 className="text-lg font-semibold">Messages</h1>
						<div className="flex flex-col mx-4 gap-2">
							{!stream.messages ||
							stream.messages.length === 0 ? (
								<span>No messages yet.</span>
							) : (
								stream.messages.map((message) => (
									<div
										key={message.id}
										className="flex flex-row gap-2 justify-between"
									>
										<span
											className={
												message.answered
													? "line-through"
													: ""
											}
										>
											{message.content}
										</span>
										<div className="flex flex-row gap-2">
											<button
												className="leading-6 font-semibold text-sm py-1 px-3 rounded-md justify-center flex bg-gray-500 hover:bg-gray-600"
												onClick={() =>
													answerMessage(
														message.id,
														message.answered,
													)
												}
											>
												{!message.answered
													? "Answer"
													: "Open"}
											</button>
											<button
												className="leading-6 font-semibold text-sm py-1 px-3 rounded-md justify-center flex bg-gray-500 hover:bg-gray-600"
												onClick={() =>
													deleteMessage(message.id)
												}
											>
												Delete
											</button>
										</div>
									</div>
								))
							)}
						</div>
					</>
				)}

				{submitted && (
					<>
						<h1 className="text-lg font-semibold">
							Stream preview
						</h1>
						<div className="mx-4">
							<VideoPlayer streamKey={user.streamKey ?? ""} />
						</div>
					</>
				)}
			</div>
		</div>
	);
};

export default StreamKeyPage;
