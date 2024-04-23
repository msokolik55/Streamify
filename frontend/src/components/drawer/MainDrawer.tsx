import { Divider } from "primereact/divider";
import { Menu } from "primereact/menu";
import { Sidebar } from "primereact/sidebar";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";

import { isDrawerOpenedAtom } from "../../atom";
import { apiUserUrl, livePath, profilePath } from "../../urls";
import SectionDrawer from "./SectionDrawer";

const MainDrawer = () => {
	const navigate = useNavigate();
	const [isDrawerOpened, setIsDrawerOpened] =
		useRecoilState(isDrawerOpenedAtom);

	const toggleDrawer = () => {
		setIsDrawerOpened((prev) => !prev);
	};

	return (
		<Sidebar visible={isDrawerOpened} onHide={toggleDrawer}>
			<Menu
				className="w-full"
				model={[
					{
						label: "Home",
						icon: "pi pi-home",
						command: () => {
							navigate("/");
						},
					},
				]}
			/>

			<Divider />

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
