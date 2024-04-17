const getLocaleTimeString = () => {
	const current = new Date();
	return current.toLocaleTimeString();
};

enum LogLevel {
	INFO = "INF",
	ERROR = "ERR",
}

const log = (
	componentName: string,
	functionName: string,
	message: string,
	args: any = undefined,
	logFunction: (...data: any[]) => void,
	level: LogLevel,
) => {
	const argsMessage = args ? ` ${args}` : "";
	logFunction(
		`[${getLocaleTimeString()}] [${level}] [${componentName}] [${functionName}] ${message}${argsMessage}`,
	);
};

export const logInfo = (
	componentName: string,
	functionName: string,
	message: string,
	args: any = undefined,
) => {
	log(componentName, functionName, message, args, console.log, LogLevel.INFO);
};

export const logError = (
	componentName: string,
	functionName: string,
	message: string,
	args: any = undefined,
) => {
	log(
		componentName,
		functionName,
		message,
		args,
		console.error,
		LogLevel.ERROR,
	);
};
