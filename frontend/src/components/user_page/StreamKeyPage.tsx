import { useRecoilValue } from "recoil";
import useSWR from "swr";

import { loggedUserIdAtom } from "../../atom";
import { IDataUser } from "../../models/IDataUser";
import fetcher from "../../models/fetcher";
import { apiUserUrl } from "../../urls";
import MainWindowError from "../errors/MainWindowError";
import StreamKeyForm from "./StreamKeyForm";
import StreamKeyTable from "./StreamKeyTable";

const StreamKeyPage = () => {
	const loggedUserId = useRecoilValue(loggedUserIdAtom);

	const { data, error } = useSWR<IDataUser, Error>(
		`${apiUserUrl}/${loggedUserId}`,
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

	return (
		<div className="flex flex-col gap-4">
			{user.streamKey === null ? <StreamKeyForm /> : <StreamKeyTable />}
		</div>
	);
};

export default StreamKeyPage;
