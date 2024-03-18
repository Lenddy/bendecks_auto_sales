import Navbar from "./navbar/Navbar";

function Container({ children }) {
	return (
		<div className="container">
			<Navbar />
			<div className="children">{children}</div>
		</div>
	);
}

export default Container;
