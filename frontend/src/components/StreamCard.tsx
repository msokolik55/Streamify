import { Link } from "react-router-dom";

import { IStream } from "../models/IStream";
import { streamPath } from "../urls";

interface IStreamCardProps {
	stream: IStream;
	username: string;
}

const StreamCard = (props: IStreamCardProps) => {
	return (
		<Link to={`${streamPath}/${props.stream.id}`}>
			<div className="flex flex-col gap-1 rounded-md hover:bg-gray-800">
				<video className="w-72 rounded-md">
					<source
						src={`/recordings/${props.stream.path}/video.mp4`}
						type="video/mp4"
					/>
				</video>

				<div className="flex flex-col px-2 pb-1">
					<span className="font-semibold">{props.stream.name}</span>
					<span className="text-sm">{props.username}</span>
				</div>
			</div>
		</Link>
	);
};

export default StreamCard;
