import { Avatar } from "primereact/avatar";
import { NavLink } from "react-router-dom";

import { IUser } from "../../models/IUser";

interface ISectionItemProps {
	user: IUser;
	to: string;
}

const SectionItem = (props: ISectionItemProps) => {
	return (
		<NavLink
			key={`li-${props.user.username}`}
			to={props.to}
			className="flex flex-row items-center gap-4 px-4 my-4"
		>
			<Avatar
				imageAlt="avatar"
				image={props.user.picture}
				shape="circle"
			/>
			<span>{props.user.username}</span>
		</NavLink>
	);
};

export default SectionItem;
