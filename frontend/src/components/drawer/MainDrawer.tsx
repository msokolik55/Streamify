import { Divider } from "primereact/divider";
import { Sidebar } from "primereact/sidebar";
import { useRecoilState } from "recoil";

import { isDrawerOpenedAtom } from "../../atom";
import { apiUserUrl, livePath, profilePath } from "../../urls";
import SectionDrawer from "./SectionDrawer";

const MainDrawer = () => {
	const [isDrawerOpened, setIsDrawerOpened] =
		useRecoilState(isDrawerOpenedAtom);

	const toggleDrawer = () => {
		setIsDrawerOpened((prev) => !prev);
	};

	return (
		<Sidebar visible={isDrawerOpened} onHide={toggleDrawer}>
			<SectionDrawer
				label="Live"
				url={`${apiUserUrl}?live=true`}
				baseUrlTo={livePath}
			/>

			<Divider />

			<SectionDrawer
				label="Profiles"
				url={apiUserUrl}
				baseUrlTo={profilePath}
			/>
		</Sidebar>
	);
};

export default MainDrawer;
