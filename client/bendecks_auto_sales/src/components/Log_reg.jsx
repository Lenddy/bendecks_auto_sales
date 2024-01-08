import React from "react";

import { Link } from "react-router-dom";

const Log_reg = () => {
	return (
		<div>
			<Link to={"/dashboard"}>
				<button>Log in</button>
			</Link>
		</div>
	);
};

export default Log_reg;
