import React from "react";
import Navbar from "./navbar/Navbar";

function Container({ children }) {
	return (
		<div className="container">
			<Navbar />
			{children}
		</div>
	);
}

export default Container;
