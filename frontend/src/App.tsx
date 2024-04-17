import axios from "axios";
import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";

import { isDarkModeAtom, loggedUserUsernameAtom } from "./atom";
import ErrorPage from "./components/errors/ErrorPage";
import { apiUrl } from "./env";
import LoginPage from "./pages/LoginPage";
import MainPage from "./pages/MainPage";
import ProfilePage from "./pages/ProfilePage";
import RecordingPage from "./pages/RecordingPage";
import RegisterPage from "./pages/RegisterPage";
import StreamPage from "./pages/StreamPage";
import PasswordPage from "./pages/account/PasswordPage";
import StreamKeyPage from "./pages/account/StreamKeyPage";
import UserPage from "./pages/account/UserPage";
import UserProfilePage from "./pages/account/UserProfilePage";
import VideoPage from "./pages/account/VideoPage";
import { socket } from "./socket";
import {
	livePath,
	loginPath,
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

	const setLoggedUsername = useSetRecoilState(loggedUserUsernameAtom);
	useEffect(() => {
		const res = axios.get(`${apiUrl}/authenticated`, {
			withCredentials: true,
		});
		res.then(async (res) => {
			const username = res.data.data.passport.user;
			setLoggedUsername(username);
		}).catch(() => {});
	}, []);

	useEffect(() => {
		socket.connect();

		return () => {
			socket.disconnect();
		};
	}, []);

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
						<Route path={loginPath} element={<LoginPage />} />
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
