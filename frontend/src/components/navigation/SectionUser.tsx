import { NavLink } from "react-router-dom";
import { useRecoilState } from "recoil";

import { isSignedInAtom } from "../../atom";
import colors from "../../styles/colors";
import { userPath } from "../../urls";

const SectionUser = () => {
	const [isSignedIn, setIsSignedIn] = useRecoilState(isSignedInAtom);

	return (
		<li className={`flex flex-col gap-4 flex-1 justify-end`}>
			{!isSignedIn ? (
				<NavLink
					to={userPath}
					className={`p-3 ${colors.text.selected} font-semibold rounded-md  ${colors.bg.navigation.item} hover:bg-gray-900 flex justify-center`}
				>
					Sign in
				</NavLink>
			) : (
				<button
					onClick={() => setIsSignedIn(false)}
					className={`p-3 ${colors.text.selected} font-semibold rounded-md  ${colors.bg.navigation.item} hover:bg-gray-900 flex justify-center`}
				>
					Sign out
				</button>
			)}
		</li>
	);
};

export default SectionUser;
