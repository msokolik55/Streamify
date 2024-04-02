const getLocaleTimeString = () => {
	const current = new Date();
	return current.toLocaleTimeString();
};

const log = (
	path: string,
	functionName: string,
	message: string,
	args: any = undefined,
	logFunction: (...data: any[]) => void,
) => {
	const argsMessage = args ? ` ${args}` : "";
	logFunction(
		`${getLocaleTimeString()}: ${path}, ${functionName}: ${message}${argsMessage}`,
	);
};

export const logInfo = (
	path: string,
	functionName: string,
	message: string,
	args: any = undefined,
) => {
	log(path, functionName, message, args, console.log);
};

export const logError = (
	path: string,
	functionName: string,
	message: string,
	args: any = undefined,
) => {
	log(path, functionName, message, args, console.error);
};
