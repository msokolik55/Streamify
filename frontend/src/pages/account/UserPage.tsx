import { Helmet } from "react-helmet";
import { Outlet } from "react-router-dom";

import HeaderLink from "../../components/user_page/HeaderLink";
import {
	userPasswordPath,
	userProfilePath,
	userStreamKeyPath,
	userVideosPath,
} from "../../urls";

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
