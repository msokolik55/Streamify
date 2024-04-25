import { Image } from "primereact/image";
import { Link } from "react-router-dom";

import { getPictureUrl } from "../functions/getPicture";
import { profilePath } from "../urls";

type ProfilePictureProps = {
	src: string;
	username: string;
};

const ProfilePicture = (props: ProfilePictureProps) => {
	return (
		<Link to={`${profilePath}/${props.username}`}>
			<Image
				src={getPictureUrl(props.src)}
				alt="Profile picture"
				imageClassName="rounded-full w-12 h-12"
			/>
		</Link>
	);
};

export default ProfilePicture;
