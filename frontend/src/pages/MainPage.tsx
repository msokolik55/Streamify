import { Helmet } from "react-helmet";
import { Outlet } from "react-router-dom";

import { MainNavigation } from "../components/drawer/MainDrawer";
import Navbar from "../components/navbar/Navbar";

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
						className={`pb-10 bg-white dark:bg-blue-900 flex flex-col flex-1 text-blue-950 dark:text-white gap-1 overflow-x-auto`}
					>
						<Outlet />
					</main>
				</div>
			</div>
		</>
	);
};

export default MainPage;
