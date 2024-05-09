import axios from "axios";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { SetStateAction, useRef } from "react";
import { useForm } from "react-hook-form";
import { useRecoilValue } from "recoil";
import { useSWRConfig } from "swr";

import { loggedUserUsernameAtom } from "../../atom";
import { logError, logInfo } from "../../logger";
import { IStream } from "../../models/IStream";
import { axiosJsonConfig } from "../../models/axiosConfig";
import { StreamEditInputs } from "../../models/form";
import { apiStreamUrl, apiUserUrl } from "../../urls";
import InputTextField from "../form/InputTextField";
import InputTextareaField from "../form/InputTextareaField";

type EditDialogProps = {
	show: boolean;
	setShow: (value: SetStateAction<boolean>) => void;
	stream: IStream;
};

const EditDialog = (props: EditDialogProps) => {
	const loggedUserUsername = useRecoilValue(loggedUserUsernameAtom);
	const toast = useRef<Toast>(null);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<StreamEditInputs>();

	const { mutate } = useSWRConfig();
	const onSubmit = async (data: StreamEditInputs) => {
		logInfo(EditDialog.name, onSubmit.name, "Fetching");

		try {
			await axios.put(
				`${apiStreamUrl}/${data.id}`,
				data,
				axiosJsonConfig,
			);

			mutate(`${apiUserUrl}/${loggedUserUsername}`);
			props.setShow(false);
		} catch (error) {
			logError(
				EditDialog.name,
				onSubmit.name,
				"Error submitting form",
				error,
			);

			toast.current?.show({
				severity: "error",
				summary: "Error",
				detail: "Error submitting form",
				life: 3000,
			});
		}
	};

	return (
		<Dialog
			visible={props.show}
			header="Edit Recording"
			onHide={() => props.setShow(false)}
		>
			<Toast ref={toast} />

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

				<InputTextField
					name="name"
					label="*Name"
					type="text"
					register={register}
					errorField={errors.name}
					options={{
						required: true,
						minLength: 3,
					}}
					defaultValue={props.stream.name}
				/>

				<InputTextareaField
					name="description"
					label="Description"
					register={register}
					errorField={errors.description}
					defaultValue={props.stream.description}
				/>

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
