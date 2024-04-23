import { InputTextarea } from "primereact/inputtextarea";
import { Message } from "primereact/message";
import { FieldError, UseFormRegister } from "react-hook-form";

interface ITextareaFieldProps {
	name: string;
	label: string;
	defaultValue?: string;
	register: UseFormRegister<any>;
	errorField: FieldError | undefined;
	options?: {
		required?: boolean;
		minLength?: number;
	};
}

const InputTextareaField = (props: ITextareaFieldProps) => {
	return (
		<div className="flex flex-col gap-2">
			<label htmlFor={props.name}>{props.label}</label>
			<InputTextarea
				{...props.register(props.name, props.options)}
				id={props.name}
				name={props.name}
				required={props.options?.required}
				minLength={props.options?.minLength}
				defaultValue={props.defaultValue}
				aria-invalid={props.errorField ? "true" : "false"}
			/>

			{props.errorField && props.errorField.type === "minLength" && (
				<Message
					severity="error"
					text={`Min. length: ${props.options?.minLength}`}
				/>
			)}
		</div>
	);
};

export default InputTextareaField;
