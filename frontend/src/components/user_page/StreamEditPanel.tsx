import axios from "axios";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRecoilValue } from "recoil";
import useSWR, { useSWRConfig } from "swr";

import { loggedUserUsernameAtom } from "../../atom";
import { logError, logInfo } from "../../logger";
import { IResponseData } from "../../models/IResponseData";
import { IUser } from "../../models/IUser";
import fetcher, { axiosConfig } from "../../models/fetcher";
import { FormState, StreamKeyInputs } from "../../models/form";
import { apiLiveUrl, apiStreamUrl, apiUserUrl } from "../../urls";
import MainWindowError from "../errors/MainWindowError";

interface IStreamEditPanelProps {
	formState: FormState;
	setFormState: (formState: FormState) => void;
}

const StreamEditPanel = (props: IStreamEditPanelProps) => {
	const loggedUserUsername = useRecoilValue(loggedUserUsernameAtom);

	const { data, error } = useSWR<IResponseData<IUser>, Error>(
		`${apiUserUrl}/${loggedUserUsername}`,
		fetcher,
	);
	const user = data?.data;

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

	const mutateUsers = () => {
		mutate(`${apiUserUrl}?live=true`);
		mutate(`${apiUserUrl}/${loggedUserUsername}`);
	};

	const setUserLive = async (live: boolean) => {
		logInfo(StreamEditPanel.name, setUserLive.name, "Fetching");

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
				StreamEditPanel.name,
				setUserLive.name,
				"Error setting user live:",
				error,
			);
		}
	};

	const upsertStream = async (inputs: StreamKeyInputs) => {
		logInfo(StreamEditPanel.name, upsertStream.name, "Fetching");

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
				StreamEditPanel.name,
				upsertStream.name,
				"Error creating stream:",
				error,
			);
		}
	};

	const onSubmit = async (data: StreamKeyInputs) => {
		if (!user.streamKey) {
			await setUserLive(true);
			props.setFormState(FormState.UPDATE);
		}
		await upsertStream(data);

		mutateUsers();
	};

	const streamExists = async () => {
		logInfo(StreamEditPanel.name, streamExists.name, "Fetching");

		try {
			const sourceExistsRes = await axios.get(
				`${apiStreamUrl}/${user.streamKey}/exists`,
				axiosConfig,
			);

			const sourceExists = sourceExistsRes.data;
			return sourceExists.data;
		} catch (error) {
			logError(
				StreamEditPanel.name,
				streamExists.name,
				"Error checking if stream exists:",
				error,
			);
		}
	};

	const deleteStream = async () => {
		logInfo(StreamEditPanel.name, deleteStream.name, "Fetching");

		try {
			await axios.delete(
				`${apiStreamUrl}/${user.streamKey}`,
				axiosConfig,
			);

			mutateUsers();
		} catch (error) {
			logError(
				StreamEditPanel.name,
				deleteStream.name,
				"Error deleting stream:",
				error,
			);
		}
	};

	const endStream = async () => {
		logInfo(StreamEditPanel.name, endStream.name, "Fetching");

		try {
			await axios.put(
				`${apiStreamUrl}/${user.streamKey}/end`,
				{},
				axiosConfig,
			);

			mutateUsers();
		} catch (error) {
			logError(
				StreamEditPanel.name,
				endStream.name,
				"Error ending stream:",
				error,
			);
		}
	};

	useEffect(() => {
		const end = async () => {
			await setUserLive(false);
			reset();

			const streamSourceExists = await streamExists();
			if (!streamSourceExists) await deleteStream();
			else await endStream();
		};
		if (props.formState === FormState.END) {
			end();
			props.setFormState(FormState.CREATE);
		}
	}, [props.formState]);

	return (
		<form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
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
				/>
				<label htmlFor="description">Description</label>
				<InputTextarea
					{...register("description")}
					id="description"
					name="description"
					aria-invalid={errors.description ? "true" : "false"}
				/>
				<Button
					label={
						props.formState === FormState.CREATE
							? "Start stream"
							: "Edit stream"
					}
					className={
						props.formState === FormState.CREATE
							? ""
							: "p-button-warning"
					}
					type="submit"
				/>

				{props.formState === FormState.UPDATE && (
					<Button
						label="End stream"
						onClick={() => props.setFormState(FormState.END)}
					/>
				)}
			</div>
		</form>
	);
};

export default StreamEditPanel;
