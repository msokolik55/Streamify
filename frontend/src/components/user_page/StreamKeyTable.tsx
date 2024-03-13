import { useRecoilValue } from "recoil";
import { useSWRConfig } from "swr";

import { loggedUserAtom } from "../../atom";
import { IUser } from "../../models/IUser";
import { apiLiveUrl, apiStreamUrl, apiUserUrl } from "../../urls";

type StreamKeyTableProps = {
	user: IUser;
};

const StreamKeyTable = (props: StreamKeyTableProps) => {
	const loggedUser = useRecoilValue(loggedUserAtom);
	const { mutate } = useSWRConfig();

	const copyStreamKey = () => {
		navigator.clipboard.writeText(props.user.streamKey ?? "");
		window.alert("Stream key copied to clipboard.");
	};

	const setUserLive = async () => {
		await fetch(apiLiveUrl, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				id: props.user.id,
				live: false,
			}),
		});
	};

	const streamExists = async () => {
		const sourceExistsRes = await fetch(
			`${apiStreamUrl}/${props.user.streamKey}/exists`,
			{
				headers: {
					"Content-Type": "application/json",
				},
			},
		);

		const sourceExists = await sourceExistsRes.json();
		return sourceExists.data;
	};

	const deleteStream = async () => {
		await fetch(apiStreamUrl, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				filePath: props.user.streamKey,
			}),
		});

		mutate(`${apiUserUrl}/${loggedUser}`);
	};

	const endLive = async () => {
		await setUserLive();

		const streamSourceExists = await streamExists();
		if (!streamSourceExists) deleteStream();

		mutate(apiLiveUrl);
		mutate(`${apiUserUrl}/${loggedUser}`);
	};

	return (
		<>
			<table>
				<tbody>
					<tr>
						<td>Name:</td>
						<td>
							{
								props.user.streams.filter(
									(stream) =>
										stream.path === props.user.streamKey,
								)[0].name
							}
						</td>
					</tr>
					<tr>
						<td>Key:</td>
						<td>{props.user.streamKey}</td>
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
