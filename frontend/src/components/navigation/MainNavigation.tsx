import colors from "../../styles/colors";
import ThemeToggle from "../ThemeToggle";
import NavigationHeader from "./NavigationHeader";
import SectionLive from "./SectionLive";
import SectionProfiles from "./SectionProfiles";
import SectionUser from "./SectionUser";

export const MainNavigation = () => {
	return (
		<div
			className={`w-72 ${colors.bg.navigation.default} ${colors.text.default} flex-col flex z-50`}
		>
			<div className="pb-4 px-6 overflow-y-auto gap-y-5 flex-col flex-grow flex">
				<NavigationHeader />
				<ThemeToggle />

				<nav className="flex-col flex-1 flex">
					<ul className="gap-x-7 flex-col flex-1 flex">
						<SectionLive />
						<SectionProfiles />

						<SectionUser />
					</ul>
				</nav>
			</div>
		</div>
	);
};
