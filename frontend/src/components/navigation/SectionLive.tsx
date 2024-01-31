import { NavLink } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import useSWR from "swr";

import { shiftUserUsernames } from "../../App";
import { userUsernamesAtom } from "../../atom";
import { IDataUsers } from "../../models/IDataUser";
import fetcher from "../../models/fetcher";
import colors from "../../styles/colors";
import { apiLiveUrl, livePath } from "../../urls";
import Counter from "../Counter";
import ErrorBlock from "../errors/ErrorBlock";
import SectionHeader from "./SectionHeader";

const SectionLive = () => {
	const pageUrl = apiLiveUrl;
	const { data, error } = useSWR<IDataUsers>(pageUrl, fetcher);
	const users = data?.data;

	const setUserIds = useSetRecoilState(userUsernamesAtom);

	if (error) return <ErrorBlock error={error} />;

	return (
		<li className="p-3 flex flex-col gap-4">
			<SectionHeader title="Live" />
			<ul className="-mx-2 gap-1 flex flex-col">
				{(!users || users.length === 0) && (
					<span className="leading6 text-sm p-2 font-semibold">
						No live streams.
					</span>
				)}

				{users?.map((user) => (
					<NavLink
						key={`li-${user.username}`}
						to={`${livePath}/${user.username}`}
						onClick={() => shiftUserUsernames(setUserIds, user.id)}
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
						<li
							className="leading-6 font-semibold p-2 flex text-sm rounded-md
								items-center justify-between"
						>
							<span>{user.username}</span>
							<Counter count={user.count ?? 0} />
						</li>
					</NavLink>
				))}
			</ul>
		</li>
	);
};

export default SectionLive;
