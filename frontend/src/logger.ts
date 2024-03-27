export const logInfo = (message: string, args: any = undefined) => {
	console.log(`${getLocaleTimeString()}: ${message} (${args ?? ""})`);
};

const getLocaleTimeString = () => {
	const current = new Date();
	return current.toLocaleTimeString();
};
