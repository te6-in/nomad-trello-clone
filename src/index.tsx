import App from "@/App";
import ReactDOM from "react-dom/client";
import { RecoilRoot } from "recoil";

const root = ReactDOM.createRoot(
	document.getElementById("root") as HTMLElement
);

root.render(
	<RecoilRoot>
		<App />
	</RecoilRoot>
);
