import { Link } from "react-router-dom";
import useSWR from "swr";
import fetcher from "../models/fetcher";
import ErrorBlock from "./ErrorBlock";
import { IDataUsers } from "../models/IDataUser";
import { apiUserUrl, profilePath } from "../urls";

const SectionProfiles = () => {
	const pageUrl = apiUserUrl;
	const { data, error } = useSWR<IDataUsers>(pageUrl, fetcher);
	const users = data?.data;

	if (error) return <ErrorBlock error={error} />;

	return (
		<>
			<ul>
				<p>Profiles</p>
				{(!users || users.length === 0) && <p>No users.</p>}
				{users?.map((user) => (
					<Link
						key={`li-${user.username}`}
						to={`${profilePath}/${user.username}`}
					>
						<li>{user.username}</li>
					</Link>
				))}
			</ul>
		</>
	);
};

export default SectionProfiles;
