import { InputText } from "primereact/inputtext";
import { Message } from "primereact/message";
import { HTMLInputTypeAttribute } from "react";
import { FieldError, UseFormRegister } from "react-hook-form";

interface ITextFieldProps {
	label: string;
	name: string;
	type: HTMLInputTypeAttribute;
	defaultValue?: string;
	register: UseFormRegister<any>;
	errorField: FieldError | undefined;
	options?: {
		required?: boolean;
		minLength?: number;
		pattern?: RegExp;
	};
	disabled?: boolean;
}

const InputTextField = (props: ITextFieldProps) => {
	return (
		<div className="flex flex-col gap-2">
			<label htmlFor={props.name}>{props.label}</label>
			<InputText
				{...props.register(props.name, props.options)}
				id={props.name}
				name={props.name}
				type={props.type}
				required={props.options?.required}
				minLength={props.options?.minLength}
				pattern={props.options?.pattern?.source}
				defaultValue={props.defaultValue}
				disabled={props.disabled}
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

export default InputTextField;
