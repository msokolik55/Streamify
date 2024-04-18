import { NavLink, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";

import { loggedUserUsernameAtom } from "../../atom";
import { logout } from "../../auth";
import colors from "../../styles/colors";
import { loginPath, userProfilePath } from "../../urls";

const SectionAccount = () => {
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

	const buttonClassName = `flex-1 p-3 ${colors.text.selected} font-semibold rounded-md  ${colors.bg.navigation.item} hover:bg-gray-900 flex justify-center`;

	return (
		<div className="flex flex-row gap-4 justify-between">
			{loggedUserUsername ? (
				<>
					<NavLink to={userProfilePath} className={buttonClassName}>
						<span>Your account</span>
					</NavLink>
					<button onClick={handleLogout} className={buttonClassName}>
						<span>Sign out</span>
					</button>
				</>
			) : (
				<NavLink to={loginPath} className={buttonClassName}>
					<span>Sign in</span>
				</NavLink>
			)}
		</div>
	);
};

export default SectionAccount;
