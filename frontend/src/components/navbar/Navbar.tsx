import colors from "../../styles/colors";
import Header from "./Header";
import SectionAccount from "./SectionAccount";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
	return (
		<div
			className={`flex items-center justify-between p-2 ${colors.light.bg.navbar.default} dark:${colors.dark.bg.navbar.default}`}
		>
			<Header />
			<div className="flex flex-row gap-4">
				<ThemeToggle />
				<SectionAccount />
			</div>
		</div>
	);
};

export default Navbar;
