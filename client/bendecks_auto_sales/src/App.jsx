import "./App.css";

import { Routes, Route } from "react-router-dom";
import { useState } from "react";

// import Log_reg from "./components/Log_reg";

import GetAllClients from "./components/clients/GetAllClients";
import GetOneClient from "./components/clients/GetOneClient";
import CreateOneClient from "./components/clients/CreateOneClient";
import GetAllVehicles from "./components/vehicles/GetAllVehicles";
import GetOneVehicle from "./components/vehicles/GetOneVehicle";
import CreateOneVehicle from "./components/vehicles/CreateOneVehicle";
import GetAllDeals from "./components/deals/GetAllDeals";
import GetOneDeal from "./components/deals/GetOneDeal";
import CreateOneDeal from "./components/deals/CreateOneDeal";

import Container from "./components/Container";

// Define the main App component
function App() {
	const [reload, setReload] = useState(false);
	return (
		// Wrap the app with ApolloProvider to access Apollo Client functionalities
		<div className="app">
			<Container>
				<Routes>
					{/* <Route exact path="/" element={<Log_reg />} /> */}
					<Route exact path="/" element={<GetAllDeals />} />

					<Route exact path="/dashboard" element={<GetAllClients reload={reload} />} />
					<Route exact path="/:id" element={<GetOneClient />} />
					<Route exact path="/createOneClient" element={<CreateOneClient reload={reload} setReload={setReload} />} />

					{/* vehicles */}
					<Route exact path="/vehicles" element={<GetAllVehicles />} />
					<Route exact path="/vehicles/:id" element={<GetOneVehicle />} />
					<Route exact path="/vehicles/add" element={<CreateOneVehicle />} />

					{/* deals routes */}
					<Route exact path="/deals" element={<GetAllDeals />} />
					<Route exact path="/deal/:id" element={<GetOneDeal />} />
					<Route exact path="/deals/add" element={<CreateOneDeal />} />
				</Routes>
			</Container>
		</div>
	);
}
export default App;
