import { Helmet } from "react-helmet";
import { Outlet } from "react-router-dom";

import {
	userPasswordPath,
	userProfilePath,
	userStreamKeyPath,
	userVideosPath,
} from "../../urls";
import HeaderLink from "./HeaderLink";

const UserPage = () => {
	return (
		<div>
			<Helmet>
				<title>User - Streamify</title>
			</Helmet>
			<div className="px-4 pt-4">
				<nav className="flex flex-row w-full justify-between gap-4 mb-2">
					<HeaderLink path={userProfilePath} title="Profile" />
					<HeaderLink path={userVideosPath} title="Videos" />
					<HeaderLink path={userStreamKeyPath} title="Stream" />
					<HeaderLink path={userPasswordPath} title="Password" />
				</nav>

				<Outlet />
			</div>
		</div>
	);
};

export default UserPage;
