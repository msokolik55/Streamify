import { useRecoilValue } from "recoil";
import useSWR, { useSWRConfig } from "swr";

import { loggedUserAtom } from "../../atom";
import { apiUrl } from "../../env";
import { IDataUser } from "../../models/IDataUser";
import fetcher from "../../models/fetcher";
import { apiLiveUrl, apiUserUrl } from "../../urls";
import MainWindowError from "../errors/MainWindowError";

const StreamKeyPage = () => {
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

	const goLive = async (live: boolean) => {
		await fetch(`${apiUrl}/live`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				id: user?.id,
				live: live,
			}),
		});

		mutate(apiLiveUrl);
		mutate(`${apiUserUrl}/${loggedUser}`);
	};

	const copyStreamKey = () => {
		navigator.clipboard.writeText(user.streamKey ?? "");
		window.alert("Stream key copied to clipboard.");
	};

	return (
		<div className="flex flex-col gap-4">
			{user.streamKey === null ? (
				<button
					onClick={() => goLive(true)}
					className="leading-6 font-semibold text-sm py-1 px-3 rounded-md justify-center flex bg-gray-500 mt-2 hover:bg-gray-600"
				>
					Go live
				</button>
			) : (
				<button
					onClick={() => goLive(false)}
					className="leading-6 font-semibold text-sm py-1 px-3 rounded-md justify-center flex bg-gray-500 mt-2 hover:bg-gray-600"
				>
					End live
				</button>
			)}

			<div className="flex gap-2 items-center">
				<span>
					Key: {user.streamKey !== null ? user.streamKey : "(none)"}
				</span>
				{user.streamKey !== null && (
					<button
						className="leading-6 font-semibold text-sm py-1 px-3 rounded-md justify-center flex bg-gray-500 hover:bg-gray-600"
						onClick={copyStreamKey}
					>
						Copy
					</button>
				)}
			</div>
		</div>
	);
};

export default StreamKeyPage;
