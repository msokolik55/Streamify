import { Button } from "primereact/button";
import { NavLink, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";

import { loggedUserUsernameAtom } from "../../atom";
import { logout } from "../../auth";
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

	return (
		<div className="flex flex-row gap-4 justify-between">
			{loggedUserUsername ? (
				<>
					<NavLink to={userProfilePath}>
						<Button
							label="Your account"
							className="p-button-text"
						/>
					</NavLink>
					<Button label="Sign out" onClick={handleLogout} />
				</>
			) : (
				<NavLink to={loginPath}>
					<Button label="Sign in" />
				</NavLink>
			)}
		</div>
	);
};

export default SectionAccount;
