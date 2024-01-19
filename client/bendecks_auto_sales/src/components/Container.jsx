import React from "react";
import Navbar from "./navbar/Navbar";

function Container({ children }) {
	return (
		<div className="container">
			<Navbar />
			<div className="child">{children}</div>
		</div>
	);
}

export default Container;
