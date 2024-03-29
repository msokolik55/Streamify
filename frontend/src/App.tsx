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
// import { logInfo } from "./logger";
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
		// const update = async () => {
		// 	logInfo("Fetching: App.dec");
		// 	if (userIds.old)
		// 		await fetch(`${apiUserUrl}/${userIds.old}/dec`, {
		// 			method: "PATCH",
		// 			headers: {
		// 				"Content-Type": "application/json",
		// 			},
		// 		});

		// 	logInfo("Fetching: App.inc");
		// 	if (userIds.curr)
		// 		await fetch(`${apiUserUrl}/${userIds.curr}/inc`, {
		// 			method: "PATCH",
		// 			headers: {
		// 				"Content-Type": "application/json",
		// 			},
		// 		});
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
