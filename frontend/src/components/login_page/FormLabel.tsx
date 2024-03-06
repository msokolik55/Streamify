type FormLabelProps = {
	title: string;
	for: string;
	required: boolean;
	minLength?: number;
};

const FormLabel = (props: FormLabelProps) => {
	return (
		<label
			htmlFor={props.for}
			className="leading-6 font-medium text-sm block"
		>
			{props.required && "*"}
			{props.title}
			{props.minLength && ` (min. ${props.minLength})`}
		</label>
	);
};

export default FormLabel;
