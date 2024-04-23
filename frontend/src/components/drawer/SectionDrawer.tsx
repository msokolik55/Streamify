import { Menu } from "primereact/menu";
import { MenuItem } from "primereact/menuitem";
import useSWR from "swr";

import { IResponseData } from "../../models/IResponseData";
import { IUser } from "../../models/IUser";
import fetcher from "../../models/fetcher";
import ErrorBlock from "../errors/ErrorBlock";
import SectionItem from "./SectionItem";

interface ISectionDrawerProps {
	label: string;
	url: string;
	baseUrlTo: string;
}

const SectionDrawer = (props: ISectionDrawerProps) => {
	const { data, error } = useSWR<IResponseData<IUser[]>>(props.url, fetcher);
	const users = data?.data;

	if (error) return <ErrorBlock error={error} />;

	const getItems: MenuItem[] =
		users?.map((user) => {
			return {
				template: (
					<SectionItem
						user={user}
						to={`${props.baseUrlTo}/${user.username}`}
					/>
				),
			};
		}) ?? [];

	return (
		<Menu
			className="w-full"
			model={[
				{
					label: props.label,
					items: getItems,
				},
			]}
		/>
	);
};

export default SectionDrawer;
