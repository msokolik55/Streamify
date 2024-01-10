import { User } from "./old/MainPage/User";
import NavigationHeader from "./NavigationHeader";
import SectionProfiles from "./SectionProfiles";
import SectionLive from "./SectionLive";

export const MainNavigation = () => {
	return (
		<nav className="navigation">
			<NavigationHeader />

			<div className="navigation__channels-categories categories">
				<SectionLive />
				<hr />
				<SectionProfiles />
			</div>

			<User />
		</nav>
	);
};
