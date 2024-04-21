import { Panel } from "primereact/panel";

import { IMessage } from "../../models/IMessage";
import MessageCard from "../MessageCard";

interface IMessagesBlockProps {
	title: string;
	messages: IMessage[];
	loggedUsername: string;
	streamKey: string;
}

const MessagesBlock = (props: IMessagesBlockProps) => {
	return (
		<Panel header={`${props.title} (${props.messages.length})`}>
			<div className="flex flex-row gap-2 overflow-x-auto py-1">
				{props.messages.map((message) => (
					<MessageCard
						key={message.id}
						message={message}
						loggedUsername={props.loggedUsername}
						streamKey={props.streamKey}
					/>
				))}
			</div>
		</Panel>
	);
};

export default MessagesBlock;
