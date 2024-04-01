// import axios from "axios";
import { useEffect } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { SetterOrUpdater, useRecoilValue } from "recoil";
import { useSWRConfig } from "swr";

import { isDarkModeAtom, userUsernames, userUsernamesAtom } from "./atom";
import MainPage from "./components/MainPage";
import ProfilePage from "./components/ProfilePage";
import RecordingPage from "./components/RecordingPage";
import RegisterPage from "./components/RegisterPage";
import StreamPage from "./components/StreamPage";
import ErrorPage from "./components/errors/ErrorPage";
import PasswordPage from "./components/user_page/PasswordPage";
import StreamKeyPage from "./components/user_page/StreamKeyPage";
import UserPage from "./components/user_page/UserPage";
import UserProfilePage from "./components/user_page/UserProfilePage";
import VideoPage from "./components/user_page/VideoPage";
// import { logError, logInfo } from "./logger";
// import { axiosConfig } from "./models/fetcher";
import {
	apiUserUrl,
	livePath,
	profilePath,
	registerPath,
	streamPath,
	userPasswordPath,
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
	const isDarkMode = useRecoilValue(isDarkModeAtom);

	useEffect(() => {
		localStorage.setItem("darkMode", isDarkMode ? "true" : "false");
	}, [isDarkMode]);

	const { mutate } = useSWRConfig();

	useEffect(() => {
		// const patchUser = async (userUsername: string, operation: string) => {
		// 	try {
		// 		await axios.patch(
		// 			`${apiUserUrl}/${userUsername}/${operation}`,
		// 			{},
		// 			axiosConfig,
		// 		);
		// 	} catch (error) {
		// 		logError(
		// 			App.name,
		// 			useEffect.name,
		// 			`Error patching user ${userUsername}:`,
		// 			error,
		// 		);
		// 		// throw error;
		// 	}
		// };
		// const update = async () => {
		// 	logInfo(App.name, useEffect.name, "Fetching", "dec");
		// 	if (userIds.old) await patchUser(userIds.old, "dec");

		// 	logInfo(App.name, useEffect.name, "Fetching", "inc");
		// 	if (userIds.curr) await patchUser(userIds.curr, "inc");
		// };
		// update();
		mutate(`${apiUserUrl}${userIds.curr}`);
	}, [userIds]);

	return (
		<div className={isDarkMode ? "dark" : ""}>
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
							<Route
								path={userVideosPath}
								element={<VideoPage />}
							/>
							<Route
								path={userStreamKeyPath}
								element={<StreamKeyPage />}
							/>
							<Route
								path={userPasswordPath}
								element={<PasswordPage />}
							/>
						</Route>
						<Route path="*" element={<ErrorPage />} />
					</Route>
					<Route path="*" element={<ErrorPage />} />
					<Route path={profilePath} element={<ProfilePage />} />
				</Routes>
			</Router>
		</div>
	);
};
