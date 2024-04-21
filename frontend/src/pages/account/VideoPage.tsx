import axios from "axios";
import { Button } from "primereact/button";
import { ConfirmPopup, confirmPopup } from "primereact/confirmpopup";
import { useState } from "react";
import { Helmet } from "react-helmet";
import { useRecoilValue } from "recoil";
import useSWR, { useSWRConfig } from "swr";

import { loggedUserUsernameAtom } from "../../atom";
import StreamCard from "../../components/StreamCard";
import MainWindowError from "../../components/errors/MainWindowError";
import EditDialog from "../../components/user_page/EditDialog";
import { logError, logInfo } from "../../logger";
import { IResponseData } from "../../models/IResponseData";
import { IStream } from "../../models/IStream";
import { IUser } from "../../models/IUser";
import fetcher, { axiosConfig } from "../../models/fetcher";
import { apiStreamUrl, apiUserUrl } from "../../urls";

const VideoPage = () => {
	const loggedUserUsername = useRecoilValue(loggedUserUsernameAtom);
	const [showEditDialog, setShowEditDialog] = useState(false);

	const { mutate } = useSWRConfig();
	const { data, error } = useSWR<IResponseData<IUser>, Error>(
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
		} catch (error) {
			logError(
				VideoPage.name,
				deleteStream.name,
				"Error deleting stream:",
				error,
			);
		}
	};

	const promptDelete = (e: any, stream: IStream) => {
		confirmPopup({
			target: e.currentTarget,
			message: "Do you want to delete this video?",
			icon: "pi pi-trash",
			defaultFocus: "reject",
			acceptClassName: "p-button-danger",
			accept: () => deleteStream(stream),
		});
	};

	const endedVideos = user.streams.filter((stream) => stream.ended);

	return (
		<div className="flex flex-row gap-4 overflow-auto flex-wrap">
			<Helmet>
				<title>{user.username} - Streamify</title>
			</Helmet>
			{endedVideos.length === 0 ? (
				<p>No videos to show.</p>
			) : (
				user.streams
					.filter((stream) => stream.ended)
					.map((stream, id) => (
						<div
							key={`stream-${stream.name}-${id}`}
							className="my-0.5"
						>
							<div className="flex flex-col gap-2">
								<StreamCard
									stream={stream}
									username={user.username}
									footer={
										<div className="flex flex-row gap-2">
											<Button
												label="Edit"
												className="flex-1 p-button-warning"
												onClick={() =>
													setShowEditDialog(true)
												}
											/>

											<Button
												label="Delete"
												className="flex-1 p-button-danger"
												onClick={(e) =>
													promptDelete(e, stream)
												}
											/>
										</div>
									}
								/>
							</div>

							<EditDialog
								show={showEditDialog}
								setShow={setShowEditDialog}
								stream={stream}
							/>

							<ConfirmPopup />
						</div>
					))
			)}
		</div>
	);
};

export default VideoPage;
