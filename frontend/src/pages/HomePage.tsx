import useSWR from "swr";

import BrowseStreamsPanel from "../components/BrowseStreamsPanel";
import { IResponseDatas } from "../models/IResponseData";
import { IStream } from "../models/IStream";
import fetcher from "../models/fetcher";
import { apiStreamUrl, livePath, streamPath } from "../urls";

const HomePage = () => {
	const { data } = useSWR<IResponseDatas<IStream>, Error>(
		apiStreamUrl,
		fetcher,
	);
	const streams = data?.data;

	const liveStreams = streams?.filter((stream) => !stream.ended) ?? [];
	const savedStreams = streams?.filter((stream) => stream.ended) ?? [];

	return (
		<div className="flex flex-col gap-4">
			<BrowseStreamsPanel
				title="Live"
				streamType="live"
				streams={liveStreams}
				getUrl={(stream) => `${streamPath}/${stream.id}`}
			/>

			<BrowseStreamsPanel
				title="Browse videos"
				streamType="saved"
				streams={savedStreams}
				getUrl={(stream) => `${livePath}/${stream.user.username}`}
			/>
		</div>
	);
};

export default HomePage;
