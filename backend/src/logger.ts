export const logInfo = (message: string, args: any = undefined) => {
	const argsMessage = args ? ` ${args}` : "";
	console.log(`${getLocaleTimeString()}: ${message}${argsMessage}`);
};

const getLocaleTimeString = () => {
	const current = new Date();
	return current.toLocaleTimeString();
};
