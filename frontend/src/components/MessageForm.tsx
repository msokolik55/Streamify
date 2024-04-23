import axios from "axios";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
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

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<MessageInputs>();

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
			<InputText
				{...register("content", { required: true })}
				type="text"
				required={true}
				placeholder="Type a message..."
				disabled={loading}
				aria-invalid={errors.content ? "true" : "false"}
				aria-required="true"
				aria-label="Message content"
				aria-placeholder="Type a message..."
			/>
			<Button type="submit" disabled={loading}>
				{loading ? "Sending..." : "Send"}
			</Button>
		</form>
	);
};

export default MessageForm;
