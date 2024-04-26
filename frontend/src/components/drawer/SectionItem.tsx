import { Image } from "primereact/image";
import { NavLink } from "react-router-dom";

import { getPictureUrl } from "../../functions/getPicture";
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
			className="flex flex-row items-center gap-4 px-4 py-2 hover:bg-gray-200"
		>
			<Image
				src={getPictureUrl(props.user.picture)}
				alt="avatar"
				imageClassName="rounded-full w-8 h-8"
			/>
			<span>{props.user.username}</span>
		</NavLink>
	);
};

export default SectionItem;
