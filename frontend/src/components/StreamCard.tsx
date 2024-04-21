import { Card } from "primereact/card";

import { IStream } from "../models/IStream";

interface IStreamCardProps {
	stream: IStream;
	username: string;
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

	return (
		<Card
			title={props.stream.name}
			subTitle={props.username}
			header={header}
			footer={props.footer}
		></Card>
	);
};

export default StreamCard;
