import CircleLive from "../../CircleLive";

const LiveIndicator = () => {
	return (
		<div className="flex flex-row items-center gap-1">
			<CircleLive />
			<span className="text-white">Live</span>
		</div>
	);
};

export default LiveIndicator;
