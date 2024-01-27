import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import burgerMenu from "../../assets/burgerMenu.svg";
import close from "../../assets/close.svg";
import dropDown from "../../assets/dropDown.svg";

function Navbar() {
	const navigate = useNavigate();
	const [isOpen, setIsOpen] = useState(false);
	const [dropdownVisibility, setDropdownVisibility] = useState({});

	// Toggle the visibility of a specific dropdown
	const toggleDropdown = (id) => {
		setDropdownVisibility((prevState) => ({
			...prevState,
			[id]: !prevState[id],
		}));
	};

	// Navigate to a route and close the sidebar
	const navigateTo = (url, dropdownId) => {
		navigate(url);
		setIsOpen(false);
		if (dropdownId) {
			toggleDropdown(dropdownId);
		}
	};

	// Render a dropdown menu
	const renderDropdown = (id, items) =>
		dropdownVisibility[id] && (
			<ul className="dropdown-menu">
				{items.map((item, index) => (
					<li
						key={index}
						className="subBtn"
						onClick={() => navigateTo(item.path, id)}
					>
						<h2>{item.label}</h2>
					</li>
				))}
			</ul>
		);

	return (
		<div className="navBar">
			<img
				src={burgerMenu}
				onClick={() => setIsOpen(!isOpen)}
				alt=""
				className="burgerIcon"
			/>

			<div className={`sidebar ${isOpen ? "open" : ""}`}>
				<div className="close" onClick={() => setIsOpen(!isOpen)}>
					<img src={close} alt="" className="burgerIcon" />
				</div>
				<ul>
					<li>
						<div
							onClick={() => toggleDropdown("clients")}
							className="dropDownTitle"
						>
							<h1>Clientes</h1>
							<img src={dropDown} alt="" className="subIcon" />
						</div>
						{renderDropdown("clients", [
							{ label: "Ver Clientes", path: "/dashboard" },
							{
								label: "Agregar Cliente",
								path: "/createOneClient",
							},
						])}
					</li>

					<li>
						<div
							onClick={() => toggleDropdown("deals")}
							className="dropDownTitle"
						>
							<h1>Ventas</h1>
							<img src={dropDown} alt="" className="subIcon" />
						</div>
						{renderDropdown("deals", [
							{ label: "Ver Ventas", path: "/deals" },
							{ label: "Agregar Venta", path: "/deals/add" },
						])}
					</li>

					<li>
						<div
							onClick={() => toggleDropdown("vehicles")}
							className="dropDownTitle"
						>
							<h1>Vehículos</h1>
							<img src={dropDown} alt="" className="subIcon" />
						</div>
						{renderDropdown("vehicles", [
							{ label: "Ver Vehículos", path: "/vehicles" },
							{
								label: "Agregar Vehículo",
								path: "/vehicles/add",
							},
						])}
					</li>
				</ul>
			</div>
		</div>
	);
}

export default Navbar;
