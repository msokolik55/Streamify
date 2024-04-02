import { Link } from "react-router-dom";

import { IStream } from "../models/IStream";
import { IUser } from "../models/IUser";
import { profilePath } from "../urls";
import Counter from "./Counter";
import ProfilePicture from "./ProfilePicture";

type VideoDetailBoxProps = {
	stream: IStream;
	user: IUser;
	showCounter: boolean;
};

const VideoDetailBox = (props: VideoDetailBoxProps) => {
	return (
		<div className="flex flex-row">
			<ProfilePicture
				src={props.user.picture}
				username={props.user.username}
			/>
			<div className="flex flex-col flex-1 p-2 gap-2">
				<div className="flex">
					<Link to={`${profilePath}/${props.user.username}`}>
						<h1 className="font-semibold">{props.user.username}</h1>
					</Link>
				</div>
				<div className="flex flex-row justify-between ">
					<h2 className="font-semibold">{props.stream.name}</h2>
					{props.showCounter && <Counter count={props.user.count} />}
				</div>
				<div className="flex flex-row justify-between ">
					<p>{props.stream.description}</p>
				</div>
			</div>
		</div>
	);
};

export default VideoDetailBox;
