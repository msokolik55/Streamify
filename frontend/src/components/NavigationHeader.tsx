import { Link } from "react-router-dom";

const NavigationHeader = () => {
	return (
		<Link to="/">
			<div className="navigation__server-header header">
				<h1 className="navigation__server-heading heading heading--1">
					Streams
				</h1>
			</div>
		</Link>
	);
};
export default NavigationHeader;
