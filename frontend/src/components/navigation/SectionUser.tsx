import { NavLink, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";

import { loggedUserUsernameAtom } from "../../atom";
import { logout } from "../../auth";
import colors from "../../styles/colors";
import { loginPath, userProfilePath } from "../../urls";

const SectionUser = () => {
	const navigate = useNavigate();
	const [loggedUserUsername, setLoggedUserUsername] = useRecoilState(
		loggedUserUsernameAtom,
	);

	const handleLogout = async () => {
		try {
			await logout();
			setLoggedUserUsername(undefined);
			navigate(loginPath);
		} catch (error) {
			console.error("Logout failed", error);
		}
	};

	return (
		<li className={`flex flex-row gap-4 justify-between`}>
			{loggedUserUsername ? (
				<>
					<NavLink
						to={userProfilePath}
						className={`flex-1 p-3 ${colors.text.selected} font-semibold rounded-md  ${colors.bg.navigation.item} hover:bg-gray-900 flex justify-center`}
					>
						Your profile
					</NavLink>
					<button
						onClick={handleLogout}
						className={`flex-1 p-3 ${colors.text.selected} font-semibold rounded-md  ${colors.bg.navigation.item} hover:bg-gray-900 flex justify-center`}
					>
						Sign out
					</button>
				</>
			) : (
				<NavLink
					to={loginPath}
					className={`flex-1 p-3 ${colors.text.selected} font-semibold rounded-md  ${colors.bg.navigation.item} hover:bg-gray-900 flex justify-center`}
				>
					Sign in
				</NavLink>
			)}
		</li>
	);
};

export default SectionUser;
