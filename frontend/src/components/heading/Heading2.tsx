interface IHeading2Props {
	title: string;
}

const Heading2 = (props: IHeading2Props) => {
	return (
		<h1 className="text-lg text-gray-700 font-semibold">{props.title}</h1>
	);
};

export default Heading2;
