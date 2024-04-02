import axios from "axios";
import { useForm } from "react-hook-form";
import { useRecoilValue } from "recoil";
import useSWR, { useSWRConfig } from "swr";

import { loggedUserUsernameAtom } from "../../atom";
import { logError, logInfo } from "../../logger";
import { IDataUser } from "../../models/IDataUser";
import fetcher, { axiosConfig } from "../../models/fetcher";
import { StreamKeyInputs } from "../../models/form";
import { apiLiveUrl, apiStreamUrl, apiUserUrl } from "../../urls";
import MainWindowError from "../errors/MainWindowError";
import FormLabel from "../login_page/FormLabel";

const StreamKeyForm = () => {
	const loggedUserUsername = useRecoilValue(loggedUserUsernameAtom);

	const { data } = useSWR<IDataUser, Error>(
		`${apiUserUrl}/${loggedUserUsername}`,
		fetcher,
	);
	const user = data?.data;

	if (!user) {
		return (
			<MainWindowError message="Cannot find user with given username." />
		);
	}

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<StreamKeyInputs>();

	const { mutate } = useSWRConfig();

	const setUserLive = async () => {
		logInfo(StreamKeyForm.name, setUserLive.name, "Fetching");

		try {
			await axios.patch(
				`${apiLiveUrl}/${user.id}`,
				{
					live: true,
				},
				axiosConfig,
			);
		} catch (error) {
			logError(
				StreamKeyForm.name,
				setUserLive.name,
				"Error setting user live:",
				error,
			);
		}
	};

	const createStream = async (inputs: StreamKeyInputs) => {
		logInfo(StreamKeyForm.name, createStream.name, "Fetching");
		logInfo(StreamKeyForm.name, createStream.name, "Creating stream: ", [
			inputs.name,
			inputs.description,
		]);

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
				StreamKeyForm.name,
				createStream.name,
				"Error creating stream:",
				error,
			);
		}
	};

	const onSubmit = async (data: StreamKeyInputs) => {
		await setUserLive();
		await createStream(data);

		mutate(`${apiUserUrl}?live=true`);
		mutate(`${apiUserUrl}/${loggedUserUsername}`);
	};

	return (
		<form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
			<div className="flex flex-col gap-2">
				<FormLabel
					title="Stream name"
					for="name"
					required={true}
					minLength={3}
				/>
				<input
					{...register("name", {})}
					id="name"
					name="name"
					type="text"
					className="leading-6 text-sm py-1 px-2 border-0 rounded-md w-full block bg-gray-800"
					aria-invalid={errors.name ? "true" : "false"}
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
				/>
			</div>

			<button
				className="leading-6 font-semibold text-sm py-1 px-3 rounded-md justify-center flex bg-gray-500 hover:bg-gray-600"
				type="submit"
			>
				Go live
			</button>
		</form>
	);
};

export default StreamKeyForm;
