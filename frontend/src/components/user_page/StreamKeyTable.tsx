import { useRecoilValue } from "recoil";
import useSWR, { useSWRConfig } from "swr";

import { getLocaleTimeString } from "../../../time";
import { LoggedUserIdAtom } from "../../atom";
import { IDataUser } from "../../models/IDataUser";
import fetcher from "../../models/fetcher";
import { apiLiveUrl, apiStreamUrl, apiUserUrl } from "../../urls";
import VideoPlayer from "../VideoPlayer";
import MainWindowError from "../errors/MainWindowError";

const StreamKeyTable = () => {
	const LoggedUserId = useRecoilValue(LoggedUserIdAtom);

	const { data } = useSWR<IDataUser, Error>(
		`${apiUserUrl}/${LoggedUserId}`,
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
		console.log(
			`${getLocaleTimeString()}: Fetching: StreamKeyTable.setUserLive`,
		);

		await fetch(apiLiveUrl, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				id: user.id,
				live: false,
			}),
		});
	};

	// const streamExists = async () => {
	// console.log(`${getLocaleTimeString()}: Fetching: StreamKeyTable.streamExists`);

	// 	const sourceExistsRes = await fetch(
	// 		`${apiStreamUrl}/${user.streamKey}/exists`,
	// 		{
	// 			headers: {
	// 				"Content-Type": "application/json",
	// 			},
	// 		},
	// 	);

	// 	const sourceExists = await sourceExistsRes.json();
	// 	return sourceExists.data;
	// };

	// const deleteStream = async () => {
	// 	console.log(`${getLocaleTimeString()}: Fetching: StreamKeyTable.deleteStream`);

	// 	await fetch(apiStreamUrl, {
	// 		method: "DELETE",
	// 		headers: {
	// 			"Content-Type": "application/json",
	// 		},
	// 		body: JSON.stringify({
	// 			filePath: user.streamKey,
	// 		}),
	// 	});

	// 	mutate(`${apiUserUrl}/${LoggedUserId}`);
	// };

	const endStream = async () => {
		console.log(
			`${getLocaleTimeString()}: Fetching: StreamKeyTable.endStream`,
		);

		await fetch(`${apiStreamUrl}/${user.streamKey}/end`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				streamPath: user.streamKey,
			}),
		});

		mutate(`${apiUserUrl}/${LoggedUserId}`);
	};

	const endLive = async () => {
		await setUserLive();

		// const streamSourceExists = await streamExists();
		// if (!streamSourceExists) await deleteStream();
		// else await endStream();
		await endStream();

		mutate(apiLiveUrl);
		mutate(`${apiUserUrl}/${LoggedUserId}`);
	};

	return (
		<>
			<table>
				<tbody>
					<tr>
						<td>Name:</td>
						<td>
							{
								user.streams.filter(
									(stream) => stream.path === user.streamKey,
								)[0].name
							}
						</td>
					</tr>
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
