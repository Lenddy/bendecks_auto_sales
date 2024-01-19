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
						{" "}
						add one Client
					</button>
				</li>
				<li>
					<button
						style={{ margin: "5px" }}
						onClick={() => navigateTo("/deals")}
					>
						{" "}
						view deals
					</button>
				</li>
				<li>
					<button
						style={{ margin: "5px" }}
						onClick={() => navigateTo("/vehicles")}
					>
						{" "}
						view vehicles
					</button>
				</li>
			</ul>
		</div>
	);
}

export default Navbar;
