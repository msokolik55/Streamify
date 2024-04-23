import { TabPanel, TabView } from "primereact/tabview";
import { useState } from "react";
import { useRecoilValue } from "recoil";
import useSWR from "swr";

import { loggedUserUsernameAtom } from "../../atom";
import VideoPlayer from "../../components/VideoPlayer";
import ErrorBlock from "../../components/errors/ErrorBlock";
import { getActualStream } from "../../components/streamHelpers";
import MessagesPanel from "../../components/user_page/MessagesPanel";
import StreamEditPanel from "../../components/user_page/StreamEditPanel";
import StreamInfoPanel from "../../components/user_page/StreamInfoPanel";
import { IResponseData } from "../../models/IResponseData";
import { IUser } from "../../models/IUser";
import fetcher from "../../models/fetcher";
import { FormState } from "../../models/form";
import { apiUserUrl } from "../../urls";

const UserStreamPage = () => {
	const loggedUserUsername = useRecoilValue(loggedUserUsernameAtom);

	const { data, error } = useSWR<IResponseData<IUser>, Error>(
		`${apiUserUrl}/${loggedUserUsername}`,
		fetcher,
	);
	const user = data?.data;
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
