import { Helmet } from "react-helmet";
import { Outlet } from "react-router-dom";

import Navbar from "../components/navbar/Navbar";
import { MainNavigation } from "../components/navigation/MainNavigation";
import colors from "../styles/colors";

const MainPage = () => {
	return (
		<>
			<Helmet>
				<title>Streamify</title>
			</Helmet>
			<div className="flex flex-col min-h-screen h-full w-full text-white">
				<Navbar />
				<div className="flex flex-row flex-1">
					<MainNavigation />
					<main
						className={`pb-10 ${colors.bg.main.default} dark:bg-black flex flex-col flex-1 ${colors.text.selected} gap-1 overflow-x-auto`}
					>
						<Outlet />
					</main>
				</div>
			</div>
		</>
	);
};

export default MainPage;
