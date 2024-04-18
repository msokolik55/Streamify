import { useEffect, useState } from "react";
import useSWR from "swr";

import { IResponseDatas } from "../../models/IResponseData";
import { IUser } from "../../models/IUser";
import fetcher from "../../models/fetcher";
import { socket } from "../../socket";
import { apiUserUrl, livePath } from "../../urls";
import ErrorBlock from "../errors/ErrorBlock";
import SectionHeader from "./SectionHeader";
import SectionItem from "./SectionItem";

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
					<SectionItem
						user={user}
						to={`${livePath}/${user.username}`}
						count={
							user.streamKey && streamViewers[user.streamKey]
								? streamViewers[user.streamKey]
								: 0
						}
					/>
				))}
			</ul>
		</li>
	);
};

export default SectionLive;
