import { useRecoilState } from "recoil";

import { isDarkModeAtom } from "../../atom";

export const ThemeToggle = () => {
	const [isDarkMode, setIsDarkMode] = useRecoilState(isDarkModeAtom);

	return (
		<div className="flex items-center">
			<span className="mr-2">Light</span>
			<div className="flex flex-row bg-white rounded-full mr-2">
				<label
					htmlFor="darkModeToggle"
					className="w-10 align-middle select-none transition duration-200 ease-in flex flex-row dark:justify-end"
				>
					<input
						type="checkbox"
						name="toggle"
						id="darkModeToggle"
						checked={isDarkMode}
						onChange={() => setIsDarkMode(!isDarkMode)}
						className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
					/>
					<span className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-500 cursor-pointer"></span>
				</label>
			</div>
			<span>Dark</span>
		</div>
	);
};

export default ThemeToggle;
