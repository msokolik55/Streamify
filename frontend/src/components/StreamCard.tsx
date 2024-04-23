import { Card } from "primereact/card";

import { IStream } from "../models/IStream";

interface IStreamCardProps {
	stream: IStream;
	footer?: JSX.Element;
}

const StreamCard = (props: IStreamCardProps) => {
	const header = (
		<video className="bg-black rounded-md">
			<source
				src={`/recordings/${props.stream.path}/video.mp4`}
				type="video/mp4"
			/>
		</video>
	);

	// const description =
	// 	props.stream.description !== "" ? (
	// 		<span>{props.stream.description}</span>
	// 	) : (
	// 		<span className="text-gray-400">(no description)</span>
	// 	);

	return (
		<Card
			title={props.stream.name}
			subTitle={props.stream.user.username}
			header={header}
			footer={props.footer}
			className="my-0.5 w-64"
		>
			{
				//description
			}
		</Card>
	);
};

export default StreamCard;
