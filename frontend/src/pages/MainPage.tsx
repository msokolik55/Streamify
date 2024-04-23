import { Helmet } from "react-helmet";
import { Outlet } from "react-router-dom";

import MainDrawer from "../components/drawer/MainDrawer";
import Navbar from "../components/navbar/Navbar";

const MainPage = () => {
	return (
		<>
			<Helmet>
				<title>Streamify</title>
			</Helmet>
			<div className="flex flex-col min-h-screen h-full w-full">
				<Navbar />
				<div className="flex flex-row flex-1">
					<MainDrawer />
					<main className="flex-1 mx-10 mt-5">
						<Outlet />
					</main>
				</div>
			</div>
		</>
	);
};

export default MainPage;
