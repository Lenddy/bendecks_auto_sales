import { useNavigate, Link, useParams } from "react-router-dom";
function Navbar() {
	const navigate = useNavigate();
	const navigateTo = (url) => navigate(url);

	return (
		<div className="navBar">
			<ul>
				<li>
					<button
						style={{ margin: "5px" }}
						onClick={() => navigateTo("/createOneClient")}
					>
						<h1>add one Client</h1>
					</button>
				</li>
				<li>
					<button
						style={{ margin: "5px" }}
						onClick={() => navigateTo("/deals")}
					>
						<h1>view deals</h1>
					</button>
				</li>
				<li>
					<button
						style={{ margin: "5px" }}
						onClick={() => navigateTo("/vehicles")}
					>
						<h1>view vehicles</h1>
					</button>
				</li>
			</ul>
		</div>
	);
}

export default Navbar;
