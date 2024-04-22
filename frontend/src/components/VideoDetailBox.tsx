import { Panel } from "primereact/panel";
import { Link } from "react-router-dom";

import { IStream } from "../models/IStream";
import { IUser } from "../models/IUser";
import { profilePath } from "../urls";
import Heading1 from "./Heading1";
import ProfilePicture from "./ProfilePicture";
import ViewerCounter from "./ViewerCounter";

type VideoDetailBoxProps = {
	stream: IStream;
	user: IUser;
	showCounter: boolean;
};

const VideoDetailBox = (props: VideoDetailBoxProps) => {
	const formatDate = (date: string) => {
		return new Intl.DateTimeFormat("cs-CZ", {
			day: "2-digit",
			month: "2-digit",
			year: "numeric",
		}).format(new Date(date));
	};

	const description =
		props.stream.description !== "" ? (
			<span>{props.stream.description}</span>
		) : (
			<span className="text-gray-400">(no description)</span>
		);

	const details = `${props.stream.maxCount} view${props.stream.maxCount !== 1 ? "s" : ""} ${formatDate(props.stream.createdAt)}`;

	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-col gap-4">
				<div className="flex flex-row justify-between">
					<Heading1 title={props.stream.name} />
					{props.showCounter && props.user.streamKey && (
						<ViewerCounter
							streamKey={props.user.streamKey}
							username={props.user.username}
						/>
					)}
				</div>

				<Link
					to={`${profilePath}/${props.user.username}`}
					className="flex flex-row items-center gap-4"
				>
					<ProfilePicture
						src={props.user.picture}
						username={props.user.username}
					/>
					<span className="font-semibold">{props.user.username}</span>
				</Link>
			</div>

			<Panel header="Description">
				<p className="font-bold mb-4">{details}</p>
				<p>{description}</p>
			</Panel>
		</div>
	);
};

export default VideoDetailBox;
