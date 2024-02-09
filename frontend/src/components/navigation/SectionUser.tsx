import { NavLink } from "react-router-dom";

import colors from "../../styles/colors";
import { userPath } from "../../urls";

const SectionUser = () => {
	return (
		<li className={`flex flex-col gap-4 flex-1 justify-end`}>
			<NavLink
				to={userPath}
				className={`p-3 ${colors.text.selected} font-semibold rounded-md  ${colors.bg.navigation.item} hover:bg-gray-900 flex justify-center`}
			>
				Sign In
			</NavLink>
		</li>
	);
};

export default SectionUser;
