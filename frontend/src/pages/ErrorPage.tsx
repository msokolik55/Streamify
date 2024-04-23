import { Button } from "primereact/button";
import { Link } from "react-router-dom";

import Heading1 from "../components/Heading1";

const ErrorPage = () => {
	return (
		<main className="flex flex-col gap-4 h-3/4 justify-center text-center">
			<p className="text-4xl font-semibold">404</p>
			<Heading1 title="Page not found" />

			<p>Sorry, we couldn't find the page you're looking for.</p>
			<Link to="/">
				<Button label="Go back home" />
			</Link>
		</main>
	);
};

export default ErrorPage;
