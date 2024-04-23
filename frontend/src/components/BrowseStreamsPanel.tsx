import { Fieldset } from "primereact/fieldset";
import { Link } from "react-router-dom";

import { IStream } from "../models/IStream";
import StreamCard from "./StreamCard";

interface IBrowseStreamsPanelProps {
	title: string;
	streamType: "live" | "saved";
	streams: IStream[];
	getUrl: (stream: IStream) => string;
}

const BrowseStreamsPanel = (props: IBrowseStreamsPanelProps) => {
	return (
		<Fieldset legend={props.title}>
			{props.streams.length === 0 ? (
				<span>No {props.streamType} streams.</span>
			) : (
				<div
					className={`flex flex-row gap-2 flex-wrap ${props.streams?.length >= 4 ? "justify-around" : ""}`}
				>
					{props.streams?.map((stream) => (
						<Link to={props.getUrl(stream)} key={stream.id}>
							<StreamCard key={stream.id} stream={stream} />
						</Link>
					))}
				</div>
			)}
		</Fieldset>
	);
};

export default BrowseStreamsPanel;
