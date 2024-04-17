import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { useRecoilValue } from "recoil";

import { isDarkModeAtom } from "./atom";
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
import {
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

export const App = () => {
	const isDarkMode = useRecoilValue(isDarkModeAtom);

	useEffect(() => {
		localStorage.setItem("darkMode", isDarkMode ? "true" : "false");
	}, [isDarkMode]);

	return (
		<div className={isDarkMode ? "dark" : ""}>
			<Helmet>
				<title>Streamify</title>
			</Helmet>
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
