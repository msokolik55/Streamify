type FormLabelProps = {
	title: string;
	for: string;
	required: boolean;
	minLength?: number;
};

const FormLabel = (props: FormLabelProps) => {
	const showMinLength = props.minLength !== undefined && props.minLength > 0;

	return (
		<label
			htmlFor={props.for}
			className="leading-6 font-medium text-sm block"
		>
			{props.required && "*"}
			{props.title}
			{showMinLength && ` (min. ${props.minLength})`}
		</label>
	);
};

export default FormLabel;
