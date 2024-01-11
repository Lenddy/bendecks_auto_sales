const moment = require("moment");

function dateCalculator(initialDate, downPayment, payment, sellPrice) {
	let paymentDates = [];
	let currentDate = moment(initialDate).add(1, "months");

	// Adjust the remaining balance for the down payment
	let remainingBalance = sellPrice - downPayment;

	while (remainingBalance > 0) {
		// Calculate the amount to pay this month
		let amountToPay = Math.min(payment, remainingBalance);

		// Add payment details to the array
		paymentDates.push({
			date: currentDate.format("DD-MM-YYYY"),
			remainingBalance: remainingBalance,
			monthPayFully: false,
			hasToPay: amountToPay,
			AmountPayedThisMonth: 0,
		});

		// Update the remaining balance
		remainingBalance -= amountToPay;

		// Move to the next month
		currentDate.add(1, "months");
	}

	return paymentDates;
}

// Example usage
const initialPaymentDate = "2024-01-15";
const downPayment = 2000;
const payment = 500;
const sellPrice = 8100;

console.log(
	dateCalculator(initialPaymentDate, downPayment, payment, sellPrice)
);
