import { PrimeReactProvider } from "primereact/api";
import React from "react";
import ReactDOM from "react-dom/client";
import { RecoilRoot } from "recoil";

import { App } from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<RecoilRoot>
		<React.StrictMode>
			<PrimeReactProvider>
				<App />
			</PrimeReactProvider>
		</React.StrictMode>
	</RecoilRoot>,
);
