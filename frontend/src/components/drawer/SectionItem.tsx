import { NavLink } from "react-router-dom";
import { useRecoilValue } from "recoil";

import { isDrawerOpenedAtom } from "../../atom";
import { IUser } from "../../models/IUser";
import colors from "../../styles/colors";
import Counter from "../Counter";

interface ISectionItemProps {
	user: IUser;
	to: string;
	count?: number;
}

const SectionItem = (props: ISectionItemProps) => {
	const isDrawerOpened = useRecoilValue(isDrawerOpenedAtom);

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
			<li
				className={`leading-6 font-semibold p-2 flex text-sm rounded-md items-center ${isDrawerOpened ? "justify-between" : "justify-center"}`}
			>
				<div className="flex flex-row gap-2">
					<img
						src={props.user.picture}
						className="w-6 h-6 rounded-full"
						alt="avatar"
					/>
					{isDrawerOpened && <span>{props.user.username}</span>}
				</div>
				{isDrawerOpened && props.count !== undefined && (
					<Counter count={props.count} />
				)}
			</li>
		</NavLink>
	);
};

export default SectionItem;
