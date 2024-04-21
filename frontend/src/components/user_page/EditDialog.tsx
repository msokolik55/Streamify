import axios from "axios";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { useRecoilValue } from "recoil";
import { useSWRConfig } from "swr";

import { loggedUserUsernameAtom } from "../../atom";
import { logError, logInfo } from "../../logger";
import { IStream } from "../../models/IStream";
import { axiosConfig } from "../../models/fetcher";
import { StreamEditInputs } from "../../models/form";
import { apiStreamUrl, apiUserUrl } from "../../urls";

type EditDialogProps = {
	show: boolean;
	setShow: (value: SetStateAction<boolean>) => void;
	stream: IStream;
};

const EditDialog = (props: EditDialogProps) => {
	const loggedUserUsername = useRecoilValue(loggedUserUsernameAtom);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<StreamEditInputs>();

	const { mutate } = useSWRConfig();
	const onSubmit = async (data: StreamEditInputs) => {
		logInfo(EditDialog.name, onSubmit.name, "Fetching");

		try {
			await axios.put(`${apiStreamUrl}/${data.id}`, data, axiosConfig);

			mutate(`${apiUserUrl}/${loggedUserUsername}`);
			props.setShow(false);
		} catch (error) {
			logError(
				EditDialog.name,
				onSubmit.name,
				"Error submitting form",
				error,
			);
		}
	};

	return (
		<Dialog
			visible={props.show}
			header="Edit Stream"
			onHide={() => props.setShow(false)}
		>
			<form
				className="flex flex-col gap-4"
				onSubmit={handleSubmit(onSubmit)}
			>
				<InputText
					{...register("id", {
						required: true,
					})}
					defaultValue={props.stream.id}
					type="hidden"
				/>

				<div className="flex flex-col gap-2">
					<label htmlFor="name">Name</label>
					<InputText
						{...register("name", {
							required: true,
							minLength: 3,
						})}
						id="name"
						name="name"
						type="text"
						required={true}
						minLength={3}
						aria-invalid={errors.name ? "true" : "false"}
						defaultValue={props.stream.name}
						className="border px-2 rounded-md"
					/>
				</div>

				<div className="flex flex-col gap-2">
					<label htmlFor="description">Description</label>
					<InputText
						{...register("description")}
						id="description"
						name="description"
						type="text"
						aria-invalid={errors.description ? "true" : "false"}
						defaultValue={props.stream.description}
						className="border px-2 rounded-md"
					/>
				</div>

				<div className="flex flex-row gap-2">
					<Button
						className="flex-1 p-button-secondary"
						label="Cancel"
						onClick={() => props.setShow(false)}
						type="button"
					/>
					<Button
						className="flex-1 p-button-success"
						label="Confirm"
						type="submit"
					/>
				</div>
			</form>
		</Dialog>
	);
};

export default EditDialog;
