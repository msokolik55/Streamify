import { Link } from "react-router-dom";

import { profilePath } from "../urls";

type ProfilePictureProps = {
	src: string;
	username: string;
};

const ProfilePicture = (props: ProfilePictureProps) => {
	return (
		<Link to={`${profilePath}/${props.username}`}>
			<div className="m-2 h-20 w-20 flex justify-center items-center">
				<img
					src={`/uploads/${props.src}` ?? "/profile_picture.jpg"}
					className="rounded-full"
					alt="avatar"
				/>
			</div>
		</Link>
	);
};

export default ProfilePicture;
