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
				`flex flex-1 justify-center ${isActive ? "border" : ""}`
			}
		>
			{props.title}
		</NavLink>
	);
};

export default HeaderLink;
