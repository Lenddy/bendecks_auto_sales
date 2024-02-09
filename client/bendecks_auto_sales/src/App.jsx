import "./App.css";

import { Routes, Route } from "react-router-dom";
import { useState } from "react";

import Log_reg from "./components/Log_reg";

import GetAllClients from "./components/clients/GetAllClients";
import GetOneClient from "./components/clients/GetOneClient";
import CreateOneClient from "./components/clients/CreateOneClient";
import UpdateOneClient from "./components/clients/UpdateOneClient";
import DeleteOneClient from "./components/clients/DeleteOneClient";
import GetAllVehicles from "./components/vehicles/GetAllVehicles";
import GetOneVehicle from "./components/vehicles/GetOneVehicle";
import CreateOneVehicle from "./components/vehicles/CreateOneVehicle";
import DeleteOneVehicle from "./components/vehicles/DeleteOneVehicle";
import UpdateOneVehicle from "./components/vehicles/UpdateOneVehicle";
import GetAllDeals from "./components/deals/GetAllDeals";
import GetOneDeal from "./components/deals/GetOneDeal";
import CreateOneDeal from "./components/deals/CreateOneDeal";
import DeleteOneDeal from "./components/deals/DeleteOneDeal";
import UpdateOneDeal from "./components/deals/UpdateOneDeal";

import Container from "./components/Container";

// Define the main App component
function App() {
	const [reload, setReload] = useState(false);
	return (
		// Wrap the app with ApolloProvider to access Apollo Client functionalities
		<div className="app">
			<Container>
				<Routes>
					<Route exact path="/" element={<Log_reg />} />
					<Route
						exact
						path="/dashboard"
						element={<GetAllClients reload={reload} />}
					/>
					<Route exact path="/:id" element={<GetOneClient />} />

					<Route
						exact
						path="/createOneClient"
						element={
							<CreateOneClient
								reload={reload}
								setReload={setReload}
							/>
						}
					/>

					<Route
						exact
						path="/update/:id"
						element={<UpdateOneClient />}
					/>

					<Route
						exact
						path="/delete/:id"
						element={<DeleteOneClient />}
					/>

					{/* vehicles */}

					<Route
						exact
						path="/vehicles"
						element={<GetAllVehicles />}
					/>

					<Route
						exact
						path="/vehicles/:id"
						element={<UpdateOneVehicle />}
						// <GetOneVehicle />
					/>

					<Route
						exact
						path="/vehicles/add"
						element={<CreateOneVehicle />}
					/>

					<Route
						exact
						path="/vehicles/update/:id"
						element={<UpdateOneVehicle />}
					/>

					<Route
						exact
						path="/vehicles/delete/:id"
						element={<DeleteOneVehicle />}
					/>
					{/* deals routes */}

					<Route exact path="/deals" element={<GetAllDeals />} />

					<Route exact path="/deals/:id" element={<GetOneDeal />} />

					<Route
						exact
						path="/deals/add"
						element={<CreateOneDeal />}
					/>

					<Route
						exact
						path="/deals/update/:id"
						element={<UpdateOneDeal />}
					/>

					<Route
						exact
						path="/deals/delete/:id"
						element={<DeleteOneDeal />}
					/>
				</Routes>
			</Container>
		</div>
	);
}
export default App;
