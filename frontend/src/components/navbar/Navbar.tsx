import { Button } from "primereact/button";
import { Menubar } from "primereact/menubar";
import { useSetRecoilState } from "recoil";

import { isDrawerOpenedAtom } from "../../atom";
import Header from "./Header";
import SectionAccount from "./SectionAccount";

// import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
	const setIsDrawerOpened = useSetRecoilState(isDrawerOpenedAtom);

	const toggleDrawer = () => {
		setIsDrawerOpened((prev) => !prev);
	};

	return (
		<Menubar
			start={
				<div className="flex flex-row gap-4">
					<Header />
					<Button icon="pi pi-bars" onClick={toggleDrawer} />
				</div>
			}
			end={
				<div className="flex flex-row gap-4">
					{/* <ThemeToggle /> */}
					<SectionAccount />
				</div>
			}
		/>
	);
};

export default Navbar;
