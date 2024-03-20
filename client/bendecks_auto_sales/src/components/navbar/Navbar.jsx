import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import burgerMenu from "../../assets/burgerMenu.svg";
import close from "../../assets/close.svg";
import dropDown from "../../assets/dropDown.svg";

function Navbar() {
	const navigate = useNavigate();
	const [isOpen, setIsOpen] = useState(false);
	const [dropdownVisibility, setDropdownVisibility] = useState(null);
	const [rotate, setRotate] = useState(false);
	const [rotate2, setRotate2] = useState(false);
	const [rotate3, setRotate3] = useState(false);
	const sidebarRef = useRef(null);

	const toggleDropdown = (id) => {
		setDropdownVisibility((prevId) => (prevId === id ? null : id));
		if (id === "clients") {
			setRotate((prev) => !prev);
			setRotate2(false);
			setRotate3(false);
		}
		if (id === "deals") {
			setRotate2((prev) => !prev);
			setRotate(false);
			setRotate3(false);
		}
		if (id === "vehicles") {
			setRotate3((prev) => !prev);
			setRotate(false);
			setRotate2(false);
		}
	};

	// Navigate to a route and close the sidebar
	const navigateTo = (url, dropdownId) => {
		navigate(url);
		setIsOpen(false);
		if (dropdownId) {
			toggleDropdown(dropdownId);
			setRotate(false);
		}
	};

	// Render a dropdown menu
	const renderDropdown = (id, items) =>
		dropdownVisibility === id && (
			<ul className={`dropdown-menu ${rotate ? "animate" : ""}`}>
				{items.map((item, index) => (
					<li
						key={index}
						className="dropdown-menu-button pointer"
						onClick={() => navigateTo(item.path, id)}
					>
						<h2>{item.label}</h2>
					</li>
				))}
			</ul>
		);

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (
				sidebarRef.current &&
				!sidebarRef.current.contains(event.target)
			) {
				setIsOpen(false);
				setRotate(false);
				setRotate2(false);
				setRotate3(false);
				setDropdownVisibility(null);
			}
		};

		document.addEventListener("click", handleClickOutside);

		return () => {
			document.removeEventListener("click", handleClickOutside);
		};
	}, []);

	return (
		<div className="nav-bar" ref={sidebarRef}>
			<img
				src={burgerMenu}
				onClick={() => setIsOpen(!isOpen)}
				alt=""
				className="nav-bar-icon pointer"
			/>

			<div className={`side-bar ${isOpen ? "open" : ""} `}>
				<div
					className="side-bar-close pointer"
					onClick={() => setIsOpen(!isOpen)}
				>
					<img src={close} alt="" className="nav-bar-icon" />
				</div>

				<ul className="side-bar-container">
					<li className={`side-bar-item `}>
						<div
							onClick={() => {
								toggleDropdown("clients");
							}}
							className="dropdown-title pointer"
						>
							<h1>Clientes</h1>
							<img
								src={dropDown}
								alt=""
								className={`nav-bar-sub-icon ${
									rotate ? "rotate" : ""
								}`}
							/>
						</div>
						{renderDropdown("clients", [
							{ label: "Ver Clientes", path: "/dashboard" },
							{
								label: "Agregar Cliente",
								path: "/createOneClient",
							},
						])}
					</li>

					<li className="side-bar-item">
						<div
							onClick={() => {
								toggleDropdown("deals");
							}}
							className="dropdown-title pointer"
						>
							<h1>Ventas</h1>
							<img
								src={dropDown}
								alt=""
								className={`nav-bar-sub-icon ${
									rotate2 ? "rotate" : ""
								}`}
							/>
						</div>
						{renderDropdown("deals", [
							{ label: "Ver Ventas", path: "/deals" },
							{ label: "Agregar Venta", path: "/deals/add" },
						])}
					</li>

					<li className="side-bar-item">
						<div
							onClick={() => {
								toggleDropdown("vehicles");
							}}
							className="dropdown-title pointer"
						>
							<h1>Vehículos</h1>
							<img
								src={dropDown}
								alt=""
								className={`nav-bar-sub-icon ${
									rotate3 ? "rotate" : ""
								}`}
							/>
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
