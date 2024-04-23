import { Panel } from "primereact/panel";

interface IErrorPageProps {
	error: Error;
}

const ErrorBlock = (props: IErrorPageProps) => {
	return (
		<Panel>
			<p>Error occured.</p>
			<p>{props.error.message}</p>
		</Panel>
	);
};

export default ErrorBlock;
