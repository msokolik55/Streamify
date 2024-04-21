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
		<div className="flex flex-col gap-2">
			<h2>{`${props.title} (${props.messages.length})`}</h2>
			<div className="flex flex-row gap-2">
				{props.messages.map((message) => (
					<MessageCard
						key={message.id}
						message={message}
						loggedUsername={props.loggedUsername}
						streamKey={props.streamKey}
					/>
				))}
			</div>
		</div>
	);
};

export default MessagesBlock;
