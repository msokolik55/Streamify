import { Outlet } from "react-router-dom";
import { useRecoilValue } from "recoil";

import { loggedUserAtom } from "../../atom";
import { userProfilePath, userStreamKeyPath, userVideosPath } from "../../urls";
import LoginPage from "../login_page/LoginPage";
import HeaderLink from "./HeaderLink";

const UserPage = () => {
	const isSignedIn = useRecoilValue(loggedUserAtom);

	return (
		<div>
			{!isSignedIn ? (
				<LoginPage />
			) : (
				<div className="px-4 pt-4">
					<nav className="flex flex-row w-full justify-between gap-4">
						<HeaderLink path={userProfilePath} title="Profile" />
						<HeaderLink path={userVideosPath} title="Videos" />
						<HeaderLink
							path={userStreamKeyPath}
							title="Stream key"
						/>
					</nav>

					<Outlet />
				</div>
			)}
		</div>
	);
};

export default UserPage;
