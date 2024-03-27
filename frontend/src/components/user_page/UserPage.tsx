import { Outlet } from "react-router-dom";
import { useRecoilValue } from "recoil";

import { loggedUserIdAtom } from "../../atom";
import {
	userPasswordPath,
	userProfilePath,
	userStreamKeyPath,
	userVideosPath,
} from "../../urls";
import LoginPage from "../login_page/LoginPage";
import HeaderLink from "./HeaderLink";

const UserPage = () => {
	const isSignedIn = useRecoilValue(loggedUserIdAtom);

	return (
		<div>
			{!isSignedIn ? (
				<LoginPage />
			) : (
				<div className="px-4 pt-4">
					<nav className="flex flex-row w-full justify-between gap-4 mb-2">
						<HeaderLink path={userProfilePath} title="Profile" />
						<HeaderLink path={userVideosPath} title="Videos" />
						<HeaderLink
							path={userStreamKeyPath}
							title="Stream key"
						/>
						<HeaderLink path={userPasswordPath} title="Password" />
					</nav>

					<Outlet />
				</div>
			)}
		</div>
	);
};

export default UserPage;
