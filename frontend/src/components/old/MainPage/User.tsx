import { Link } from "react-router-dom";
import useSWR from "swr";

import { IDataUser } from "../../../models/IDataUser";
import fetcher from "../../../models/fetcher";
import { userId } from "../../../store/user";
import { apiUserUrl } from "../../../urls";

export const User = () => {
	const { data, error } = useSWR<IDataUser>(
		`${apiUserUrl}/${userId}`,
		fetcher,
	);
	const user = data?.data;

	return (
		<Link to="user/profile/" className="mt-auto">
			<div className="navigation__profile-picture profile__picture profile-picture">
				<img
					src={user?.picture}
					alt="User's profile picture"
					className="profile-picture__image image"
				/>
			</div>
			<div className="profile__info">
				<div className="profile__name">{user?.username}</div>
				<div className="profile__slug">#1204</div>
			</div>
		</Link>
	);
};
