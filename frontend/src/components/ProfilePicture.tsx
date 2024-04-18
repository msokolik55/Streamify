import { Link } from "react-router-dom";

import { profilePath } from "../urls";

type ProfilePictureProps = {
	src: string;
	username: string;
};

const ProfilePicture = (props: ProfilePictureProps) => {
	return (
		<Link to={`${profilePath}/${props.username}`}>
			<div className="m-2 flex justify-center items-center">
				<img
					src={props.src ?? "/profile_picture.jpg"}
					className="h-20 w-20 rounded-full"
					alt="avatar"
				/>
			</div>
		</Link>
	);
};

export default ProfilePicture;
