const getLocaleTimeString = () => {
	const current = new Date();
	return current.toLocaleTimeString();
};

const log = (
	componentName: string,
	functionName: string,
	message: string,
	args: any = undefined,
	logFunction: (...data: any[]) => void,
) => {
	const argsMessage = args ? ` ${args}` : "";
	logFunction(
		`${getLocaleTimeString()}: ${componentName}${functionName}: ${message}${argsMessage}`,
	);
};

export const logInfo = (
	componentName: string,
	functionName: string,
	message: string,
	args: any = undefined,
) => {
	log(componentName, functionName, message, args, console.log);
};

export const logError = (
	componentName: string,
	functionName: string,
	message: string,
	args: any = undefined,
) => {
	log(componentName, functionName, message, args, console.error);
};
