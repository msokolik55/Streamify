export const getPictureUrl = (picture: string) => {
	return picture !== null ? `/${picture}` : "/profile_picture.jpg";
};
