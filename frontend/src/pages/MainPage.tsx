import { Helmet } from "react-helmet";
import { Outlet } from "react-router-dom";

import { MainNavigation } from "../components/navigation/MainNavigation";
import colors from "../styles/colors";

const MainPage = () => {
	return (
		<div className="flex min-h-screen h-full w-full">
			<Helmet>
				<title>Streamify</title>
			</Helmet>
			<MainNavigation />
			<main
				className={`pb-10 ${colors.bg.main.default} dark:bg-black flex flex-col flex-1 ${colors.text.selected} gap-1 overflow-x-auto`}
			>
				<Outlet />
			</main>
		</div>
	);
};

export default MainPage;
