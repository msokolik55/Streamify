import { NavLink } from "react-router-dom";

type HeaderLinkProps = {
	path: string;
	title: string;
};

const HeaderLink = (props: HeaderLinkProps) => {
	return (
		<NavLink
			to={props.path}
			className={({ isActive }) =>
				`flex flex-1 justify-center py-2 font-semibold rounded-md hover:bg-gray-700
				${isActive ? "bg-gray-700" : ""}`
			}
		>
			{props.title}
		</NavLink>
	);
};

export default HeaderLink;
