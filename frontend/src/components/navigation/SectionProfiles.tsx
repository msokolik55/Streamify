import { NavLink } from "react-router-dom";
import useSWR from "swr";
import fetcher from "../../models/fetcher";
import ErrorBlock from "../errors/ErrorBlock";
import { IDataUsers } from "../../models/IDataUser";
import { apiUserUrl, profilePath } from "../../urls";
import SectionHeader from "./SectionHeader";
import colors from "../../styles/colors";

const SectionProfiles = () => {
	const pageUrl = apiUserUrl;
	const { data, error } = useSWR<IDataUsers>(pageUrl, fetcher);
	const users = data?.data;

	if (error) return <ErrorBlock error={error} />;

	return (
		<li className="p-3 flex flex-col gap-4">
			<SectionHeader title="Profiles" />
			<ul className="-mx-2 gap-1 flex flex-col">
				{(!users || users.length === 0) && (
					<span className="leading6 text-sm p-2 font-semibold">
						No users.
					</span>
				)}

				{users?.map((user) => (
					<NavLink
						key={`li-${user.username}`}
						to={`${profilePath}/${user.username}`}
						className={({ isActive }) =>
							`${
								isActive
									? `${colors.text.selected} ${colors.bg.navigation.item}`
									: ""
							}
							rounded-md
							hover:${colors.text.selected} hover:${colors.bg.navigation.item}`
						}
					>
						<li className="leading-6 font-semibold p-2 flex text-sm rounded-md">
							<span>{user.username}</span>
						</li>
					</NavLink>
				))}
			</ul>
		</li>
	);
};

export default SectionProfiles;
