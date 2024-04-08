import axios from "axios";
import { useState } from "react";
import { Helmet } from "react-helmet";
import { useRecoilValue } from "recoil";
import useSWR, { useSWRConfig } from "swr";

import { loggedUserUsernameAtom } from "../../atom";
import { logError, logInfo } from "../../logger";
import { IResponseData } from "../../models/IResponseData";
import { IStream } from "../../models/IStream";
import fetcher, { axiosConfig } from "../../models/fetcher";
import { apiStreamUrl, apiUserUrl } from "../../urls";
import StreamCard from "../StreamCard";
import MainWindowError from "../errors/MainWindowError";
import DeleteDialog from "./DeleteDialog";
import EditDialog from "./EditDialog";

const VideoPage = () => {
	const loggedUserUsername = useRecoilValue(loggedUserUsernameAtom);
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);
	const [showEditDialog, setShowEditDialog] = useState(false);

	const { mutate } = useSWRConfig();
	const { data, error } = useSWR<IResponseData, Error>(
		`${apiUserUrl}/${loggedUserUsername}`,
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

	const deleteStream = async (stream: IStream) => {
		logInfo(VideoPage.name, deleteStream.name, "Fetching");

		try {
			await axios.delete(`${apiStreamUrl}/${stream.path}`, axiosConfig);

			mutate(`${apiUserUrl}/${loggedUserUsername}`);
			setShowDeleteDialog(false);
		} catch (error) {
			logError(
				VideoPage.name,
				deleteStream.name,
				"Error deleting stream:",
				error,
			);
		}
	};

	return (
		<div className="flex flex-row gap-4 overflow-auto flex-wrap">
			<Helmet>
				<title>{user.username} - Streamify</title>
			</Helmet>
			{user.streams.filter((stream) => stream.ended).length === 0 && (
				<p>No videos to show.</p>
			)}
			{user.streams
				.filter((stream) => stream.ended)
				.map((stream, id) => (
					<div key={`stream-${stream.name}-${id}`}>
						<div className="flex flex-col gap-2">
							<StreamCard
								stream={stream}
								username={user.username}
							/>

							<div className="flex flex-row gap-2">
								<button
									onClick={() => setShowEditDialog(true)}
									className="flex-1 bg-gray-800 font-semibold rounded-md py-2 hover:bg-gray-700"
								>
									Edit
								</button>
								<button
									onClick={() => setShowDeleteDialog(true)}
									className="flex-1 bg-gray-800 font-semibold rounded-md py-2 hover:bg-gray-700"
								>
									Delete
								</button>
							</div>
						</div>

						{showDeleteDialog && (
							<DeleteDialog
								setShow={setShowDeleteDialog}
								delete={deleteStream}
								stream={stream}
							/>
						)}

						{showEditDialog && (
							<EditDialog
								setShow={setShowEditDialog}
								stream={stream}
							/>
						)}
					</div>
				))}
		</div>
	);
};

export default VideoPage;
