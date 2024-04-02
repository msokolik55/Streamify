import axios from "axios";
import { useRecoilValue } from "recoil";
import useSWR, { useSWRConfig } from "swr";

import { loggedUserUsernameAtom } from "../../atom";
import { logError, logInfo } from "../../logger";
import { IDataUser } from "../../models/IDataUser";
import fetcher, { axiosConfig } from "../../models/fetcher";
import { apiLiveUrl, apiStreamUrl, apiUserUrl } from "../../urls";
import VideoPlayer from "../VideoPlayer";
import MainWindowError from "../errors/MainWindowError";
import { getActualStream } from "../streamHelpers";

const StreamKeyTable = () => {
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

	const { mutate } = useSWRConfig();

	const copyStreamKey = () => {
		navigator.clipboard.writeText(user.streamKey ?? "");
		window.alert("Stream key copied to clipboard.");
	};

	const setUserLive = async () => {
		logInfo(StreamKeyTable.name, setUserLive.name, "Fetching");

		try {
			await axios.patch(
				`${apiLiveUrl}/${user.id}`,
				{
					live: false,
				},
				axiosConfig,
			);
		} catch (error) {
			logError(
				StreamKeyTable.name,
				setUserLive.name,
				"Error setting user live:",
				error,
			);
		}
	};

	const streamExists = async () => {
		logInfo(StreamKeyTable.name, streamExists.name, "Fetching");

		try {
			const sourceExistsRes = await axios.get(
				`${apiStreamUrl}/${user.streamKey}/exists`,
				axiosConfig,
			);

			const sourceExists = sourceExistsRes.data;
			return sourceExists.data;
		} catch (error) {
			logError(
				StreamKeyTable.name,
				streamExists.name,
				"Error checking if stream exists:",
				error,
			);
		}
	};

	const deleteStream = async () => {
		logInfo(StreamKeyTable.name, deleteStream.name, "Fetching");

		try {
			await axios.delete(
				`${apiStreamUrl}/${user.streamKey}`,
				axiosConfig,
			);

			mutate(`${apiUserUrl}/${loggedUserUsername}`);
		} catch (error) {
			logError(
				StreamKeyTable.name,
				deleteStream.name,
				"Error deleting stream:",
				error,
			);
		}
	};

	const endStream = async () => {
		logInfo(StreamKeyTable.name, endStream.name, "Fetching");

		try {
			await axios.put(
				`${apiStreamUrl}/${user.streamKey}/end`,
				{},
				axiosConfig,
			);

			mutate(`${apiUserUrl}/${loggedUserUsername}`);
		} catch (error) {
			logError(
				StreamKeyTable.name,
				endStream.name,
				"Error ending stream:",
				error,
			);
		}
	};

	const endLive = async () => {
		await setUserLive();

		const streamSourceExists = await streamExists();
		if (!streamSourceExists) await deleteStream();
		else await endStream();

		mutate(`${apiUserUrl}?live=true`);
		mutate(`${apiUserUrl}/${loggedUserUsername}`);
	};

	return (
		<>
			<table>
				<tbody>
					<tr>
						<td>Key:</td>
						<td>{user.streamKey}</td>
						<td>
							<button
								className="leading-6 font-semibold text-sm py-1 px-3 rounded-md justify-center flex bg-gray-500 hover:bg-gray-600"
								onClick={copyStreamKey}
							>
								Copy
							</button>
						</td>
					</tr>
					<tr>
						<td>Name:</td>
						<td>{getActualStream(user).name}</td>
					</tr>
					<tr>
						<td>Description:</td>
						<td>{getActualStream(user).description}</td>
						<td>
							<button
								className="leading-6 font-semibold text-sm py-1 px-3 rounded-md justify-center flex bg-gray-500 hover:bg-gray-600"
								onClick={copyStreamKey}
							>
								Copy
							</button>
						</td>
					</tr>
				</tbody>
			</table>

			<VideoPlayer streamKey={user.streamKey ?? ""} />

			<button
				className="leading-6 font-semibold text-sm py-1 px-3 rounded-md justify-center flex bg-gray-500 hover:bg-gray-600"
				onClick={async () => await endLive()}
			>
				End live
			</button>
		</>
	);
};

export default StreamKeyTable;
