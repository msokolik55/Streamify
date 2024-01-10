interface ICounterProps {
	count: number;
}

const Counter = (props: ICounterProps) => {
	return <p>Count: {props.count}</p>;
};

export default Counter;
