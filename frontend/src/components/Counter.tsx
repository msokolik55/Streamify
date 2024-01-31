import CircleLive from "./CircleLive";

interface ICounterProps {
	count: number;
}

const Counter = (props: ICounterProps) => {
	return (
		<div className="flex flex-row items-center gap-1 justify-center">
			<CircleLive />
			<span>{props.count}</span>
		</div>
	);
};

export default Counter;
