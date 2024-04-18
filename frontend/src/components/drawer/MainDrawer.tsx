import { useRecoilState } from "recoil";

import { isDrawerOpenedAtom } from "../../atom";
import colors from "../../styles/colors";
import SectionLive from "./SectionLive";
import SectionProfiles from "./SectionProfiles";

const MainDrawer = () => {
	const [isDrawerOpened, setIsDrawerOpened] =
		useRecoilState(isDrawerOpenedAtom);

	const toggleDrawer = () => {
		setIsDrawerOpened((prev) => !prev);
	};

	return (
		<div
			className={`flex flex-col
				${colors.light.bg.drawer.default}
				${colors.light.text.default}
				dark:${colors.dark.bg.drawer.default}
				dark:${colors.dark.text.default}`}
		>
			<div
				className="flex justify-end p-2
					dark:hover:bg-gray-700 hover:cursor-pointer
					ease-in-out transition-all duration-300
					font-extrabold
					hover:bg-blue-400"
				onClick={toggleDrawer}
			>
				<span>{isDrawerOpened ? "<" : ">"}</span>
			</div>
			<div
				className={`flex-col z-50 flex ${isDrawerOpened ? "w-60" : "w-auto"} ease-in-out transition-all duration-300`}
			>
				<div className="pb-4 px-2 overflow-y-auto gap-y-5 flex-col flex-grow flex">
					<nav className="flex-col flex-1 flex">
						<div className="gap-x-7 flex-col flex-1 flex">
							<hr />
							<SectionLive />
							<hr />
							<SectionProfiles />
						</div>
					</nav>
				</div>
			</div>
		</div>
	);
};

export default MainDrawer;
