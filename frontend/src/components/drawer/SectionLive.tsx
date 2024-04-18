import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import useSWR from "swr";

import { IResponseDatas } from "../../models/IResponseData";
import { IUser } from "../../models/IUser";
import fetcher from "../../models/fetcher";
import { socket } from "../../socket";
import colors from "../../styles/colors";
import { apiUserUrl, livePath } from "../../urls";
import Counter from "../Counter";
import ErrorBlock from "../errors/ErrorBlock";
import SectionHeader from "./SectionHeader";

const SectionLive = () => {
	const [streamViewers, setStreamViewers] = useState<{
		[streamId: string]: number;
	}>({});
	const { data, error } = useSWR<IResponseDatas<IUser>>(
		`${apiUserUrl}?live=true`,
		fetcher,
	);
	const users = data?.data;

	useEffect(() => {
		socket.on("viewer_counts", (count: any) => {
			setStreamViewers(count);
		});
		return () => {
			socket.off("viewer_counts");
		};
	}, []);

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
							{user.streamKey && (
								<Counter
									count={streamViewers[user.streamKey] ?? 0}
								/>
							)}
						</li>
					</NavLink>
				))}
			</ul>
		</li>
	);
};

export default SectionLive;
