import { NavLink } from "react-router-dom";

import { IUser } from "../../models/IUser";
import colors from "../../styles/colors";
import Counter from "../Counter";

interface ISectionItemProps {
	user: IUser;
	to: string;
	count?: number;
}

const SectionItem = (props: ISectionItemProps) => {
	return (
		<NavLink
			key={`li-${props.user.username}`}
			to={props.to}
			className={({ isActive }) =>
				`${
					isActive
						? `${colors.light.text.selected} ${colors.light.bg.drawer.item}`
						: ""
				}
							rounded-md
							hover:text-white hover:bg-blue-600`
			}
		>
			<li className="leading-6 font-semibold p-2 flex text-sm rounded-md items-center justify-between">
				<div className="flex flex-row gap-2">
					<img
						src={props.user.picture}
						className="w-6 h-6 rounded-full"
						alt="avatar"
					/>
					<span>{props.user.username}</span>
				</div>
				{props.count !== undefined && <Counter count={props.count} />}
			</li>
		</NavLink>
	);
};

export default SectionItem;
