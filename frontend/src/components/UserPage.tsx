import { Outlet } from "react-router-dom";
import { useRecoilState } from "recoil";

import { isSignedInAtom } from "../atom";
import { userProfilePath, userStreamKeyPath, userVideosPath } from "../urls";
import HeaderLink from "./HeaderLink";
import LoginPage from "./LoginPage";

const UserPage = () => {
	const [isSignedIn, setIsSignedIn] = useRecoilState(isSignedInAtom);

	return (
		<div>
			{!isSignedIn ? (
				<LoginPage />
			) : (
				<div className="px-4 pt-4">
					<nav className="flex flex-row w-full justify-between">
						<HeaderLink path={userProfilePath} title="Profile" />
						<HeaderLink path={userVideosPath} title="Videos" />
						<HeaderLink
							path={userStreamKeyPath}
							title="Stream key"
						/>
					</nav>

					<button
						onClick={() => setIsSignedIn(false)}
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
