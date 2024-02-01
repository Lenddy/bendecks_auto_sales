const moment = require("moment");

// function dateCalculator(initialDate, downPayment, payment, sellPrice) {
// 	let paymentDates = [];
// 	let currentDate = moment(initialDate).add(1, "months");

// 	// Adjust the remaining balance for the down payment
// 	let remainingBalance = sellPrice - downPayment;

// 	while (remainingBalance > 0) {
// 		// Calculate the amount to pay this month
// 		let amountToPay = Math.min(payment, remainingBalance);

// 		// Add payment details to the array
// 		paymentDates.push({
// 			date: currentDate.format("YYYY-MM-DD"),
// 			remainingBalance: remainingBalance,
// 			monthPayFully: false,
// 			hasToPay: amountToPay,
// 			AmountPayedThisMonth: 0,
// 		});

// 		// Update the remaining balance
// 		remainingBalance -= amountToPay;

// 		// Move to the next month
// 		currentDate.add(1, "months");
// 	}

// 	return paymentDates;
// }

// // Example usage
// const initialPaymentDate = "2024-01-15";
// const downPayment = 2000;
// const payment = 500;
// const sellPrice = 8100;

// console.log(
// 	dateCalculator(initialPaymentDate, downPayment, payment, sellPrice)
// );

// const test_deals = [
// 	{
// 		id: "7c3f07b3-5628-4a59-8d65-8b41edf1a773",
// 		dayOfDeal: "2023-12-07",
// 		downPayment: 1948.1,
// 		payment: 401.63,
// 		paymentDates: [
// 			{
// 				payment_id: "dbef95f4-e673-4b3e-908a-0b7a4f94dbe6",
// 				monthFullyPay: false,
// 				isLate: false,
// 				dateOfPayment: "2024-1-15",
// 				hasToPay: 640.2,
// 				amountPayedThisMonth: 413.4,
// 				remainingBalance: 4941.4,
// 				latenessFee: 0,
// 				daysLate: 0,
// 			},
// 		],
// 		remainingBalance: 31595.19,
// 		sellingPrice: 50151.39,
// 		client_id: {
// 			id: "404e7a97-8966-492b-bdae-06065e57dc9d",
// 			clientName: "Client18",
// 			clientLastName: "Lastname31",
// 			cellPhone: "6618761233",
// 		},
// 		vehicle_id: {
// 			id: "a0c8c9aa-6a98-4dcf-80ee-9b1d24eea23d",
// 			vehicleName: "Vehicle4",
// 			vehicleModel: "Model21",
// 			year: 2011,
// 			color: "Black",
// 			boughtPrice: 12826.41,
// 		},
// 		createdAt: "2024-01-17",
// 		updatedAt: "2024-01-15",
// 	},
// ];

// async function isDealPaymentPayed(testDeals) {
// 	const today = moment();

// 	for (const deal of testDeals) {
// 		let dealUpdated = false;
// 		const lastUpdate = moment(deal.updatedAt);
// 		const daysSinceLastUpdate = moment("2024-01-18").diff(
// 			lastUpdate,
// 			"days"
// 		);

// 		if (daysSinceLastUpdate >= 1) {
// 			for (const paymentInfo of deal.paymentDates) {
// 				const paymentDueDate = moment(paymentInfo.dateOfPayment);
// 				const totalDaysLate = today.diff(paymentDueDate, "days");

// 				if (totalDaysLate > 0) {
// 					if (paymentInfo.daysLate === 0) {
// 						paymentInfo.daysLate = totalDaysLate;
// 					} else {
// 						paymentInfo.daysLate += daysSinceLastUpdate;
// 					}

// 					if (!paymentInfo.isLate) {
// 						paymentInfo.latenessFee = 80;
// 						paymentInfo.isLate = true;
// 					} else {
// 						const additionalDaysLate =
// 							totalDaysLate - paymentInfo.daysLate;
// 						paymentInfo.latenessFee += 10 * additionalDaysLate;
// 					}

// 					paymentInfo.latenessFee = Math.min(
// 						paymentInfo.latenessFee,
// 						80 + 10 * 44
// 					);
// 					dealUpdated = true;
// 				}

// 				// Here you would normally update the database, but for testing,
// 				// we just print the updated paymentInfo.
// 				if (dealUpdated) {
// 					console.log(
// 						`Updated paymentInfo for deal ${deal.id}:`,
// 						paymentInfo
// 					);
// 				}
// 			}
// 		}

// 		// Normally, update the deal's updatedAt field here
// 		if (dealUpdated) {
// 			deal.updatedAt = today.format("YYYY-MM-DD");
// 		}
// 	}

// 	return testDeals; // or return some summary of updates
// }

// // Example usage with the generated test data
// isDealPaymentPayed(test_deals).then((updatedDeals) => {
// 	console.log("Updated Deals:", updatedDeals[0].paymentDates);
// });
