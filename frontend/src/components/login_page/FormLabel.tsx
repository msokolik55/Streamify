type FormLabelProps = {
	title: string;
	for: string;
};

const FormLabel = (props: FormLabelProps) => {
	return (
		<label
			htmlFor={props.for}
			className="leading-6 font-medium text-sm block"
		>
			{props.title}
		</label>
	);
};

export default FormLabel;
