import { Outlet } from "react-router-dom";
import { useRecoilState } from "recoil";

import { loggedUserAtom } from "../../atom";
import { userProfilePath, userStreamKeyPath, userVideosPath } from "../../urls";
import LoginPage from "../login_page/LoginPage";
import HeaderLink from "./HeaderLink";

const UserPage = () => {
	const [isSignedIn, setLoggedUser] = useRecoilState(loggedUserAtom);

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

					<button
						onClick={() => setLoggedUser(undefined)}
						className="leading-6 font-semibold text-sm py-1 px-3 rounded-md justify-center flex bg-gray-500 mt-2 hover:bg-gray-600"
					>
						Sign out
					</button>

					<Outlet />
				</div>
			)}
		</div>
	);
};

export default UserPage;
