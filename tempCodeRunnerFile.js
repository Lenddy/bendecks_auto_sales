const moment = require("moment");

function dateCalculator(initialDate, downPayment, payment, remainingBalance) {
	let paymentDates = [];
	let currentDate = moment(initialDate);

	// Adjust the remaining balance for the down payment
	remainingBalance -= downPayment;

	console.log("The remaining balance is ", remainingBalance);

	while (remainingBalance > 0) {
		// Increment the month
		currentDate.add(1, "months");
		paymentDates.push(currentDate.format("YYYY-MM-DD"));

		// Update the remaining balance
		remainingBalance -= payment;
		console.log("The remaining balance is ", remainingBalance);
	}

	console.log("These are the payments dates", paymentDates);
	return paymentDates;
}

// Example usage
const initialPaymentDate = "2024-01-15";
const downPayment = 1000;
const payment = 300;
const remainingBalance = 5000;

console.log(
	dateCalculator(initialPaymentDate, downPayment, payment, remainingBalance)
);
