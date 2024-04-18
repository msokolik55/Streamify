import useSWR from "swr";

import { IResponseDatas } from "../../models/IResponseData";
import { IUser } from "../../models/IUser";
import fetcher from "../../models/fetcher";
import { apiUserUrl, profilePath } from "../../urls";
import ErrorBlock from "../errors/ErrorBlock";
import SectionHeader from "./SectionHeader";
import SectionItem from "./SectionItem";

const SectionProfiles = () => {
	const { data, error } = useSWR<IResponseDatas<IUser>>(apiUserUrl, fetcher);
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
					<SectionItem
						user={user}
						to={`${profilePath}/${user.username}`}
					/>
				))}
			</ul>
		</li>
	);
};

export default SectionProfiles;
