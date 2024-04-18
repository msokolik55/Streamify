import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSWRConfig } from "swr";

import { logError, logInfo } from "../logger";
import { MessageInputs } from "../models/form";
import { apiMessageUrl, apiStreamUrl, messagePath } from "../urls";

type MessageFormProps = {
	streamKey: string;
	username: string | undefined;
};

const MessageForm = (props: MessageFormProps) => {
	const [loading, setLoading] = useState(false);

	const { register, handleSubmit, reset } = useForm<MessageInputs>();

	const { mutate } = useSWRConfig();
	const onSubmit = async (data: MessageInputs) => {
		logInfo(MessageForm.name, onSubmit.name, "Fetching");
		setLoading(true);

		try {
			await axios.post(apiMessageUrl, {
				content: data.content,
				username: props.username,
				streamKey: props.streamKey,
			});
			reset();

			mutate(`${apiStreamUrl}/${props.streamKey}${messagePath}`);
		} catch (error) {
			logError(
				MessageForm.name,
				onSubmit.name,
				"Error submitting message form:",
				error,
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<input
				className="text-black dark:text-white"
				{...register("content", { required: true })}
				type="text"
				required={true}
				placeholder="Type a message..."
				disabled={loading}
			/>
			<button type="submit" disabled={loading}>
				{loading ? "Sending..." : "Send"}
			</button>
		</form>
	);
};

export default MessageForm;
