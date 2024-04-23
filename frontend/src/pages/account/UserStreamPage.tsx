import { TabPanel, TabView } from "primereact/tabview";
import { useState } from "react";
import { useRecoilValue } from "recoil";

import { loggedUserUsernameAtom } from "../../atom";
import MessagesPanel from "../../components/account/MessagesPanel";
import StreamEditPanel from "../../components/account/StreamEditPanel";
import StreamInfoPanel from "../../components/account/StreamInfoPanel";
import ErrorBlock from "../../components/error/ErrorBlock";
import VideoPlayer from "../../components/video/VideoPlayer";
import { getActualStream } from "../../functions/getStreams";
import { useLoggedUser } from "../../functions/useFetch";
import { FormState } from "../../models/form";

const UserStreamPage = () => {
	const loggedUserUsername = useRecoilValue(loggedUserUsernameAtom);
	const { data: user, error } = useLoggedUser();

	const [formState, setFormState] = useState(
		!user?.streamKey ? FormState.CREATE : FormState.UPDATE,
	);

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

	const submitted = formState === FormState.UPDATE && user.streamKey;
	const stream = getActualStream(user);

	return (
		<div className="flex flex-col gap-4">
			<TabView>
				{formState !== FormState.CREATE && (
					<TabPanel header="Info" className="flex flex-col gap-4">
						<StreamInfoPanel streamKey={user.streamKey ?? ""} />
					</TabPanel>
				)}
				<TabPanel
					header={formState === FormState.CREATE ? "Create" : "Edit"}
				>
					<StreamEditPanel
						formState={formState}
						setFormState={setFormState}
					/>
				</TabPanel>

				{submitted && (
					<TabPanel header="Messages">
						<MessagesPanel
							messages={stream.messages}
							loggedUsername={loggedUserUsername ?? ""}
							streamKey={user.streamKey ?? ""}
						/>
					</TabPanel>
				)}

				{submitted && (
					<TabPanel header="Preview">
						<VideoPlayer streamKey={user.streamKey ?? ""} />
					</TabPanel>
				)}
			</TabView>
		</div>
	);
};

export default UserStreamPage;
