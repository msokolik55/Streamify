import { Link } from "react-router-dom";

const NavigationHeader = () => {
	return (
		<Link to="/">
			<div className="flex-shrink h-16 flex items-center">
				<h1 className="text-2xl font-bold">Streams</h1>
			</div>
		</Link>
	);
};
export default NavigationHeader;
