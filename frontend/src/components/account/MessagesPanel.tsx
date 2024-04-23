import { IMessage } from "../../models/IMessage";
import MessagesBlock from "./MessagesBlock";

interface IMessagesPanelProps {
	messages: IMessage[];
	loggedUsername: string;
	streamKey: string;
}

const MessagesPanel = (props: IMessagesPanelProps) => {
	const activeMessages = props.messages.filter(
		(message) => !message.answered,
	);
	const answeredMessages = props.messages.filter(
		(message) => message.answered,
	);

	return (
		<div className="flex flex-col mx-4 gap-4">
			{!props.messages || props.messages.length === 0 ? (
				<span>No messages.</span>
			) : (
				<>
					<MessagesBlock
						title="Active"
						messages={activeMessages}
						loggedUsername={props.loggedUsername}
						streamKey={props.streamKey}
					/>

					<MessagesBlock
						title="Answered"
						messages={answeredMessages}
						loggedUsername={props.loggedUsername}
						streamKey={props.streamKey}
					/>
				</>
			)}
		</div>
	);
};

export default MessagesPanel;
