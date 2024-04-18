import colors from "../../styles/colors";
import SectionLive from "./SectionLive";
import SectionProfiles from "./SectionProfiles";

export const MainNavigation = () => {
	return (
		<div
			className={`w-60 ${colors.light.bg.drawer.default} dark:${colors.dark.bg.drawer.default} ${colors.light.text.default} dark:${colors.dark.text.default} flex-col flex z-50`}
		>
			<div className="pb-4 px-2 overflow-y-auto gap-y-5 flex-col flex-grow flex">
				<nav className="flex-col flex-1 flex">
					<div className="gap-x-7 flex-col flex-1 flex">
						<SectionLive />
						<SectionProfiles />
					</div>
				</nav>
			</div>
		</div>
	);
};
