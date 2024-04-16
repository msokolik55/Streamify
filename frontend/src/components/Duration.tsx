interface IDurationProps {
	seconds: number;
}

const Duration = (props: IDurationProps) => {
	function format(seconds: number) {
		const date = new Date(seconds * 1000);
		const hh = date.getUTCHours();
		const mm = date.getUTCMinutes();
		const ss = pad(date.getUTCSeconds().toString());
		if (hh) {
			return `${hh}:${pad(mm.toString())}:${ss}`;
		}
		return `${mm}:${ss}`;
	}

	function pad(string: string) {
		return ("0" + string).slice(-2);
	}

	return (
		<time dateTime={`P${Math.round(props.seconds)}S`}>
			{format(props.seconds)}
		</time>
	);
};

export default Duration;
