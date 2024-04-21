import { Menubar } from "primereact/menubar";

import Header from "./Header";
import SectionAccount from "./SectionAccount";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
	return (
		<Menubar
			start={<Header />}
			end={
				<div className="flex flex-row gap-4">
					<ThemeToggle />
					<SectionAccount />
				</div>
			}
		/>
	);
};

export default Navbar;
