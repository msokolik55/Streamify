import { FileUpload } from "primereact/fileupload";
import { FieldError, UseFormRegister } from "react-hook-form";

interface ITextFieldProps {
	label: string;
	name: string;
	defaultValue?: string;
	register: UseFormRegister<any>;
	errorField: FieldError | undefined;
	options?: {
		required?: boolean;
	};
	accept?: string;
	disabled?: boolean;
}

const FileUploadField = (props: ITextFieldProps) => {
	return (
		<div className="flex flex-col gap-2">
			<label htmlFor={props.name}>{props.label}</label>
			<FileUpload
				{...props.register(props.name, props.options)}
				mode="basic"
				id={props.name}
				name={props.name}
				accept={props.accept}
				disabled={props.disabled}
				aria-invalid={props.errorField ? "true" : "false"}
				aria-required={props.options?.required ? "true" : "false"}
				aria-label={props.label}
			/>
		</div>
	);
};

export default FileUploadField;