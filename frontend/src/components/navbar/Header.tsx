import { Image } from "primereact/image";
import { Link } from "react-router-dom";

const Header = () => {
	return (
		<Link to="/">
			<Image src="/logo.webp" imageClassName="w-12 h-12 rounded-full" />
		</Link>
	);
};
export default Header;
