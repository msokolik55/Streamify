import { Outlet } from "react-router-dom";
import { MainNavigation } from "./MainNavigation";

const MainPage = () => {
	return (
		<>
			<MainNavigation />
			<Outlet />
		</>
	);
};

export default MainPage;
