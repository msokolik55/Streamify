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

	const buttonClassName = `flex-1 px-3 py-2 font-semibold rounded-md align-middle text-center block text-nowrap
		${colors.light.text.selected}
		${colors.light.bg.drawer.item}
		hover:bg-blue-900
		hover:text-white`;

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