interface IErrorPageProps {
	error: Error;
}

const ErrorBlock = (props: IErrorPageProps) => {
	return (
		<>
			<p>Error occured.</p>
			<p>{props.error.message}</p>
		</>
	);
};

export default ErrorBlock;
