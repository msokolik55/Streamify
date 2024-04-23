import axios from "axios";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { ConfirmPopup, confirmPopup } from "primereact/confirmpopup";
import { Toast } from "primereact/toast";
import { useRef } from "react";
import { useSWRConfig } from "swr";

import { logError, logInfo } from "../logger";
import { IMessage } from "../models/IMessage";
import { axiosJsonConfig } from "../models/axiosConfig";
import UserStreamPage from "../pages/account/UserStreamPage";
import { apiMessageUrl, apiStreamUrl, apiUserUrl, messagePath } from "../urls";

interface IMessageCardProps {
	message: IMessage;
	loggedUsername: string;
	streamKey: string;
}

const MessageCard = (props: IMessageCardProps) => {
	const toast = useRef<Toast>(null);
	const { mutate } = useSWRConfig();

	const mutateMessage = () => {
		mutate(`${apiUserUrl}/${props.loggedUsername}`);
		mutate(`${apiStreamUrl}/${props.streamKey}${messagePath}`);
	};

	const deleteMessage = async (messageId: string) => {
		logInfo(UserStreamPage.name, deleteMessage.name, "Fetching");

		try {
			await axios.delete(
				`${apiMessageUrl}/${messageId}`,
				axiosJsonConfig,
			);

			mutateMessage();
		} catch (error) {
			logError(
				UserStreamPage.name,
				deleteMessage.name,
				"Error deleting message",
				error,
			);

			toast.current?.show({
				severity: "error",
				summary: "Error",
				detail: "Error deleting message",
				life: 3000,
			});
		}
	};

	const promptDelete = (e: any) => {
		confirmPopup({
			target: e.currentTarget,
			message: "Do you want to delete this video?",
			icon: "pi pi-trash",
			defaultFocus: "reject",
			acceptClassName: "p-button-danger",
			accept: () => deleteMessage(props.message.id),
		});
	};

	const answerMessage = async (messageId: string, answered: boolean) => {
		logInfo(UserStreamPage.name, answerMessage.name, "Fetching");

		try {
			await axios.patch(
				`${apiMessageUrl}/${messageId}`,
				{
					answered: !answered,
				},
				axiosJsonConfig,
			);

			mutateMessage();
		} catch (error) {
			logError(
				UserStreamPage.name,
				answerMessage.name,
				"Error answering message",
				error,
			);

			toast.current?.show({
				severity: "error",
				summary: "Error",
				detail: "Error answering message",
				life: 3000,
			});
		}
	};

	const footer = (
		<div className="flex flex-row gap-2">
			<Toast ref={toast} />
			<ConfirmPopup />

			<Button
				label={props.message.answered ? "Open" : "Answer"}
				onClick={() =>
					answerMessage(props.message.id, props.message.answered)
				}
			></Button>
			<Button
				label="Delete"
				className="p-button-danger"
				onClick={promptDelete}
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
