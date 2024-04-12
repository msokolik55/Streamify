const getLocaleTimeString = () => {
	const current = new Date();
	return current.toLocaleTimeString();
};

enum LogLevel {
	INFO = "INF",
	ERROR = "ERR",
}

const log = (
	path: string,
	functionName: string,
	message: string,
	args: any = undefined,
	logFunction: (...data: any[]) => void,
	level: LogLevel,
) => {
	const argsMessage = args ? ` ${args}` : "";
	logFunction(
		`[${getLocaleTimeString()}] [${level}] [${path}] [${functionName}] ${message}${argsMessage}`,
	);
};

export const logInfo = (
	path: string,
	functionName: string,
	message: string,
	args: any = undefined,
) => {
	log(path, functionName, message, args, console.log, LogLevel.INFO);
};

export const logError = (
	path: string,
	functionName: string,
	message: string,
	args: any = undefined,
) => {
	log(path, functionName, message, args, console.error, LogLevel.ERROR);
};
