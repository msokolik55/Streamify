import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ProfilePage from "./components/ProfilePage";
import MainPage from "./components/MainPage";
import { useEffect } from "react";
import { SetterOrUpdater, useRecoilValue } from "recoil";
import { userUsernames, userUsernamesAtom } from "./atom";
import { useSWRConfig } from "swr";
import StreamPage from "./components/StreamPage";
import ErrorPage from "./components/ErrorPage";
import { apiUserUrl, livePath, profilePath } from "./urls";

export const shiftUserUsernames = (
	setUserUsernames: SetterOrUpdater<userUsernames>,
	id: string
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

		const update = async () => {
			if (userIds.old) await fetch(`${pageUrl}/${userIds.old}/dec`);
			if (userIds.curr) await fetch(`${pageUrl}/${userIds.curr}/inc`);
		};

		// update();
		mutate(`${pageUrl}${userIds.curr}`);
	}, [userIds]);

	return (
		<div className="app">
			<Router>
				<Routes>
					<Route path="/" element={<MainPage />}>
						<Route
							path={`${profilePath}/:username`}
							element={<ProfilePage />}
						/>
						<Route
							path={`${livePath}/:username`}
							element={<StreamPage />}
						/>
						<Route path="*" element={<ErrorPage />} />
					</Route>
					<Route path="*" element={<ErrorPage />} />
					{/* <Route path={profilePath} element={<ProfilePage />} /> */}
				</Routes>
			</Router>
		</div>
	);
};
