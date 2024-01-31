import ErrorBlock from "./ErrorBlock";

interface IMainWindowErrorProps {
	message: string;
}

const MainWindowError = (props: IMainWindowErrorProps) => {
	return (
		<main className="main-window main-channel">
			<ErrorBlock error={new Error(props.message)} />
		</main>
	);
};

export default MainWindowError;
