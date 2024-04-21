import { Divider } from "primereact/divider";
import { Sidebar } from "primereact/sidebar";
import { useRecoilState } from "recoil";

import { isDrawerOpenedAtom } from "../../atom";
import SectionLive from "./SectionLive";
import SectionProfiles from "./SectionProfiles";

const MainDrawer = () => {
	const [isDrawerOpened, setIsDrawerOpened] =
		useRecoilState(isDrawerOpenedAtom);

	const toggleDrawer = () => {
		setIsDrawerOpened((prev) => !prev);
	};

	return (
		<Sidebar visible={isDrawerOpened} onHide={toggleDrawer}>
			<div className="pb-4 px-2 overflow-y-auto gap-y-5 flex-col flex-grow flex">
				<nav className="flex-col flex-1 flex">
					<div className="gap-x-7 flex-col flex-1 flex">
						<SectionLive />
						<Divider />
						<SectionProfiles />
					</div>
				</nav>
			</div>
		</Sidebar>
	);
};

export default MainDrawer;
