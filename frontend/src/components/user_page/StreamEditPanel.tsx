import axios from "axios";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useRecoilValue } from "recoil";
import useSWR, { useSWRConfig } from "swr";

import { loggedUserUsernameAtom } from "../../atom";
import { logError, logInfo } from "../../logger";
import { IResponseData } from "../../models/IResponseData";
import { IUser } from "../../models/IUser";
import { axiosJsonConfig } from "../../models/axiosConfig";
import fetcher from "../../models/fetcher";
import { FormState, StreamKeyInputs } from "../../models/form";
import { apiLiveUrl, apiStreamUrl, apiUserUrl } from "../../urls";
import ErrorBlock from "../errors/ErrorBlock";
import InputTextField from "../form/InputTextField";
import InputTextareaField from "../form/InputTextareaField";
import { getActualStream } from "../streamHelpers";

interface IStreamEditPanelProps {
	formState: FormState;
	setFormState: (formState: FormState) => void;
}

const StreamEditPanel = (props: IStreamEditPanelProps) => {
	const loggedUserUsername = useRecoilValue(loggedUserUsernameAtom);
	const toast = useRef<Toast>(null);

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
				axiosJsonConfig,
			);
		} catch (error) {
			logError(
				StreamEditPanel.name,
				setUserLive.name,
				"Error setting user live",
				error,
			);

			toast.current?.show({
				severity: "error",
				summary: "Error",
				detail: "Error setting user live",
				life: 3000,
			});
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
				axiosJsonConfig,
			);
		} catch (error) {
			logError(
				StreamEditPanel.name,
				upsertStream.name,
				"Error creating stream",
				error,
			);

			toast.current?.show({
				severity: "error",
				summary: "Error",
				detail: "Error creating stream",
				life: 3000,
			});
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
				axiosJsonConfig,
			);

			const sourceExists = sourceExistsRes.data;
			return sourceExists.data;
		} catch (error) {
			logError(
				StreamEditPanel.name,
				streamExists.name,
				"Error checking if stream exists",
				error,
			);

			toast.current?.show({
				severity: "error",
				summary: "Error",
				detail: "Error checking if stream exists",
				life: 3000,
			});
		}
	};

	const deleteStream = async () => {
		logInfo(StreamEditPanel.name, deleteStream.name, "Fetching");

		try {
			await axios.delete(
				`${apiStreamUrl}/${user.streamKey}`,
				axiosJsonConfig,
			);

			mutateUsers();
		} catch (error) {
			logError(
				StreamEditPanel.name,
				deleteStream.name,
				"Error deleting stream",
				error,
			);

			toast.current?.show({
				severity: "error",
				summary: "Error",
				detail: "Error deleting stream",
				life: 3000,
			});
		}
	};

	const endStream = async () => {
		logInfo(StreamEditPanel.name, endStream.name, "Fetching");

		try {
			await axios.put(
				`${apiStreamUrl}/${user.streamKey}/end`,
				{},
				axiosJsonConfig,
			);

			mutateUsers();
		} catch (error) {
			logError(
				StreamEditPanel.name,
				endStream.name,
				"Error ending stream",
				error,
			);

			toast.current?.show({
				severity: "error",
				summary: "Error",
				detail: "Error ending stream",
				life: 3000,
			});
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

	const stream = getActualStream(user);

	return (
		<form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
			<Toast ref={toast} />

			<div className="mx-4 flex flex-col gap-3">
				<InputTextField
					name="name"
					label="*Name"
					type="text"
					register={register}
					errorField={errors.name}
					options={{
						required: true,
						minLength: 3,
					}}
					defaultValue={stream.name}
				/>

				<InputTextareaField
					name="description"
					label="Description"
					register={register}
					errorField={errors.description}
					defaultValue={stream.description}
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
