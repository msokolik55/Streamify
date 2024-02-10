import { useRecoilValue } from "recoil";
import useSWR, { useSWRConfig } from "swr";

import { loggedUserAtom } from "../../atom";
import { IDataUser } from "../../models/IDataUser";
import { IStream } from "../../models/IStream";
import fetcher from "../../models/fetcher";
import { apiStreamUrl, apiUserUrl } from "../../urls";
import StreamCard from "../StreamCard";
import MainWindowError from "../errors/MainWindowError";

const VideoPage = () => {
	const loggedUser = useRecoilValue(loggedUserAtom);

	const { data, error } = useSWR<IDataUser, Error>(
		`${apiUserUrl}/${loggedUser}`,
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

	const { mutate } = useSWRConfig();
	const deleteStream = async (stream: IStream) => {
		await fetch(apiStreamUrl, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				streamId: stream.id,
				filePath: stream.path,
			}),
		});

		mutate(`${apiUserUrl}/${loggedUser}`);
	};

	return (
		<div className="flex flex-row gap-4 overflow-auto flex-wrap">
			{user.streams.length === 0 && <p>No videos to show.</p>}
			{user.streams.map((stream, id) => (
				<div
					className="flex flex-col gap-2"
					key={`stream-${stream.name}-${id}`}
				>
					<StreamCard stream={stream} username={user.username} />

					<div className="flex flex-row gap-2">
						<button
							className="flex-1 bg-gray-800 font-semibold rounded-md py-2"
							disabled={true}
						>
							Edit
						</button>
						<button
							onClick={() => deleteStream(stream)}
							className="flex-1 bg-gray-800 font-semibold rounded-md py-2 hover:bg-gray-700"
							disabled={false}
						>
							Delete
						</button>
					</div>
				</div>
			))}
		</div>
	);
};

export default VideoPage;
