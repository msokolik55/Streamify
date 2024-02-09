import { Outlet } from "react-router-dom";
import { useRecoilValue } from "recoil";

import { isSignedInAtom } from "../atom";
import LoginPage from "./LoginPage";

const UserPage = () => {
	const isSignedIn = useRecoilValue(isSignedInAtom);

	return (
		<div>
			{isSignedIn ? (
				<>
					<nav>
						<div>Profile</div>
						<div>Videos</div>
						<div>Stream key</div>
					</nav>
					<Outlet />
				</>
			) : (
				<LoginPage />
			)}
		</div>
	);
};

export default UserPage;
