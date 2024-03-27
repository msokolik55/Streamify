import { NavLink } from "react-router-dom";
import { useRecoilState } from "recoil";

import { loggedUserUsernameAtom } from "../../atom";
import colors from "../../styles/colors";
import { userProfilePath } from "../../urls";

const SectionUser = () => {
	const [loggedUserUsername, setLoggedUserUsername] = useRecoilState(
		loggedUserUsernameAtom,
	);

	return (
		<li className={`flex flex-row gap-4 justify-between`}>
			<NavLink
				to={userProfilePath}
				className={`flex-1 p-3 ${colors.text.selected} font-semibold rounded-md  ${colors.bg.navigation.item} hover:bg-gray-900 flex justify-center`}
			>
				{!loggedUserUsername ? "Sign in" : "Your profile"}
			</NavLink>
			{loggedUserUsername && (
				<button
					onClick={() => setLoggedUserUsername(undefined)}
					className={`flex-1 p-3 ${colors.text.selected} font-semibold rounded-md  ${colors.bg.navigation.item} hover:bg-gray-900 flex justify-center`}
				>
					Sign out
				</button>
			)}
		</li>
	);
};

export default SectionUser;
