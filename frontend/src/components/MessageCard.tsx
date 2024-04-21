import axios from "axios";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { useSWRConfig } from "swr";

import { logError, logInfo } from "../logger";
import { IMessage } from "../models/IMessage";
import { axiosConfig } from "../models/fetcher";
import UserStreamPage from "../pages/account/UserStreamPage";
import { apiMessageUrl, apiStreamUrl, apiUserUrl, messagePath } from "../urls";

interface IMessageCardProps {
	message: IMessage;
	loggedUsername: string;
	streamKey: string;
}

const MessageCard = (props: IMessageCardProps) => {
	const { mutate } = useSWRConfig();

	const mutateMessage = () => {
		mutate(`${apiUserUrl}/${props.loggedUsername}`);
		mutate(`${apiStreamUrl}/${props.streamKey}${messagePath}`);
	};

	const deleteMessage = async (messageId: string) => {
		logInfo(UserStreamPage.name, deleteMessage.name, "Fetching");

		try {
			await axios.delete(`${apiMessageUrl}/${messageId}`, axiosConfig);

			mutateMessage();
		} catch (error) {
			logError(
				UserStreamPage.name,
				deleteMessage.name,
				"Error deleting message",
				error,
			);
		}
	};

	const answerMessage = async (messageId: string, answered: boolean) => {
		logInfo(UserStreamPage.name, answerMessage.name, "Fetching");

		try {
			await axios.patch(
				`${apiMessageUrl}/${messageId}`,
				{
					answered: !answered,
				},
				axiosConfig,
			);

			mutateMessage();
		} catch (error) {
			logError(
				UserStreamPage.name,
				answerMessage.name,
				"Error answering message",
				error,
			);
		}
	};

	const footer = (
		<div className="flex flex-row gap-2">
			<Button
				label={props.message.answered ? "Open" : "Answer"}
				onClick={() =>
					answerMessage(props.message.id, props.message.answered)
				}
			></Button>
			<Button
				label="Delete"
				onClick={() => deleteMessage(props.message.id)}
			/>
		</div>
	);
	return (
		<Card footer={footer}>
			<span className={props.message.answered ? "line-through" : ""}>
				{props.message.content}
			</span>
		</Card>
	);
};

export default MessageCard;
