import { TabMenu } from "primereact/tabmenu";
import { Helmet } from "react-helmet";
import { Outlet, useNavigate } from "react-router-dom";

import { useLoggedUser } from "../../components/getHelpers";
import {
	loginPath,
	userPasswordPath,
	userProfilePath,
	userStreamKeyPath,
	userVideosPath,
} from "../../urls";

const UserPage = () => {
	const navigate = useNavigate();

	const { user } = useLoggedUser();
	if (!user) {
		navigate(loginPath);
	}

	const items = [
		{ label: "Profile", command: () => navigate(userProfilePath) },
		{ label: "Videos", command: () => navigate(userVideosPath) },
		{ label: "Stream", command: () => navigate(userStreamKeyPath) },
		{ label: "Password", command: () => navigate(userPasswordPath) },
	];

	return (
		<div>
			<Helmet>
				<title>User - Streamify</title>
			</Helmet>
			<div className="px-4">
				<TabMenu model={items} />
				<Outlet />
			</div>
		</div>
	);
};

export default UserPage;
