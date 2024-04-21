interface IHeading1Props {
	title: string;
}

const Heading1 = (props: IHeading1Props) => {
	return <h1 className="text-2xl text-gray-800 font-bold">{props.title}</h1>;
};

export default Heading1;
