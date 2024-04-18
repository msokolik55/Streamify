import { Link } from "react-router-dom";

const Header = () => {
	return (
		<Link to="/">
			<div className="flex flex-row gap-4">
				<img src="/logo.webp" className="w-12 h-12 rounded-full" />
			</div>
		</Link>
	);
};
export default Header;
