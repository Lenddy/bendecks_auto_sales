import React from "react";

import { Link } from "react-router-dom";

const Log_reg = () => {
	// !!!! the function is already done in the back end is call isDealPaymentPayed
	// make  function that will update isLate, latenessFee and days late base on the date of payment if the there is no payment on the day of the payment day the next day there should be a 80 dollar fee and there should be 10 dollars fee every day after and there is a limit of 45 days  the 80 dollar fee should happen only once after the date of payment if no payment has be made

	// this function should  run  when the log in btn is click and when there is a restart on the page after being log in

	// you should also work on a way to update the info on the screen if there are changes made to the info on the data base

	// and go to the client model an make it a one to many with the deal so you can also give a count on how many deals a client has

	// and dont  forget to make the function  for when a payment is late

	return (
		<div>
			<Link to={"/dashboard"}>
				<button>Log in</button>
			</Link>
		</div>
	);
};

export default Log_reg;
