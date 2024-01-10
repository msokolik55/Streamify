import { Link } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import useSWR from "swr";
import { shiftUserUsernames } from "../App";
import { userUsernamesAtom } from "../atom";
import fetcher from "../models/fetcher";
import ErrorBlock from "./ErrorBlock";
import { IDataUsers } from "../models/IDataUser";
import { apiLiveUrl, livePath } from "../urls";

const SectionLive = () => {
	const pageUrl = apiLiveUrl;
	const { data, error } = useSWR<IDataUsers>(pageUrl, fetcher);
	const users = data?.data;

	const setUserIds = useSetRecoilState(userUsernamesAtom);

	if (error) return <ErrorBlock error={error} />;

	return (
		<>
			<ul>
				<p>Live</p>
				{(!users || users.length === 0) && <p>No live streams.</p>}
				{users?.map((user) => (
					<Link
						key={`li-${user.username}`}
						to={`${livePath}/${user.username}`}
						onClick={() => shiftUserUsernames(setUserIds, user.id)}
					>
						<li
							style={{
								display: "flex",
								justifyContent: "space-between",
							}}
						>
							<div>{user.username}</div>
							<div>{user.count ?? 0}</div>
						</li>
					</Link>
				))}
			</ul>
		</>
	);
};

export default SectionLive;
