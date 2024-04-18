import Header from "./Header";
import SectionAccount from "./SectionAccount";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
	return (
		<div className="flex items-center justify-between p-4 bg-gray-800 dark:bg-gray-900">
			<Header />
			<div className="flex flex-row gap-4">
				<ThemeToggle />
				<SectionAccount />
			</div>
		</div>
	);
};

export default Navbar;
