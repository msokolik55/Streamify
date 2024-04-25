const getTimeFromDate = (date: Date) => new Date(date).getTime();

export const transformAny = (value: any) => {
	const { createdAt, updatedAt, ...rest } = value;
	return {
		...rest,
		createdAt: getTimeFromDate(createdAt),
		updatedAt: getTimeFromDate(updatedAt),
	};
};
