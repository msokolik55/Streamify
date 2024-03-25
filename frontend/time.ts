export const getLocaleTimeString = () => {
	const current = new Date();
	return current.toLocaleTimeString();
};
