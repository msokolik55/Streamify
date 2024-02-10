import { useEffect } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { SetterOrUpdater, useRecoilValue } from "recoil";
import { useSWRConfig } from "swr";

import { userUsernames, userUsernamesAtom } from "./atom";
import MainPage from "./components/MainPage";
import ProfilePage from "./components/ProfilePage";
import RecordingPage from "./components/RecordingPage";
import RegisterPage from "./components/RegisterPage";
import StreamPage from "./components/StreamPage";
import ErrorPage from "./components/errors/ErrorPage";
import StreamKeyPage from "./components/user_page/StreamKeyPage";
import UserPage from "./components/user_page/UserPage";
import UserProfilePage from "./components/user_page/UserProfilePage";
import VideoPage from "./components/user_page/VideoPage";
import {
	apiUserUrl,
	livePath,
	profilePath,
	registerPath,
	streamPath,
	userPath,
	userProfilePath,
	userStreamKeyPath,
	userVideosPath,
} from "./urls";

export const shiftUserUsernames = (
	setUserUsernames: SetterOrUpdater<userUsernames>,
	id: string,
) => {
	setUserUsernames((oldIds) => {
		if (id === oldIds.curr) return oldIds;

		return { old: oldIds.curr, curr: id };
	});
};

export const App = () => {
	const userIds = useRecoilValue(userUsernamesAtom);

	const { mutate } = useSWRConfig();

	useEffect(() => {
		const pageUrl = apiUserUrl;

		// const update = async () => {
		// 	if (userIds.old) await fetch(`${pageUrl}/${userIds.old}/dec`);
		// 	if (userIds.curr) await fetch(`${pageUrl}/${userIds.curr}/inc`);
		// };

		// update();
		mutate(`${pageUrl}${userIds.curr}`);
	}, [userIds]);

	return (
		<Router>
			<Routes>
				<Route path="/" element={<MainPage />}>
					<Route
						path={`${profilePath}/:username`}
						element={<ProfilePage />}
					/>
					<Route
						path={`${streamPath}/:streamId`}
						element={<RecordingPage />}
					/>
					<Route
						path={`${livePath}/:username`}
						element={<StreamPage />}
					/>
					<Route path={registerPath} element={<RegisterPage />} />
					<Route path={userPath} element={<UserPage />}>
						<Route
							path={userProfilePath}
							element={<UserProfilePage />}
						/>
						<Route path={userVideosPath} element={<VideoPage />} />
						<Route
							path={userStreamKeyPath}
							element={<StreamKeyPage />}
						/>
					</Route>
					<Route path="*" element={<ErrorPage />} />
				</Route>
				<Route path="*" element={<ErrorPage />} />
				<Route path={profilePath} element={<ProfilePage />} />
			</Routes>
		</Router>
	);
};
