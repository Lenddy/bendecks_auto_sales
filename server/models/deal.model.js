//importing Schema and model to create the schema and saving it to the data base
const { Schema, model, mongoose } = require("mongoose");

const DealSchema = new Schema(
	{
		//attributes for the data base
		downPayment: {
			type: Number,
			required: true,
		},

		payment: {
			type: Number,
			required: true,
			// min: [1, "Model Of The Vehicle Must Be At Least 1 Character Long"],
		},

		dayOfDeal: {
			type: String,
			require: true,
		},

		dealPayments: {
			type: [
				{
					_id: false,
					payment_id: {
						type: String,
						required: true,
					},
					dateOfPayment: {
						type: String,
						required: true,
					},
					daysLate: {
						type: Number,
						required: true,
					},
					hasToPay: {
						type: Number,
						required: true,
					},
					amountPayedThisMonth: {
						type: Number,
						required: true,
					},
					latenessFee: {
						type: Number,
						required: true,
					},
					isLate: {
						type: Boolean,
						required: true,
					},
					monthFullyPay: {
						type: Boolean,
						required: true,
					},
				},
			],
			required: true,
		},

		sellingPrice: {
			type: Number,
			required: true,
		},

		remainingBalance: {
			type: Number,
			required: true,
		},

		totalLatenessFee: {
			type: Number,
			required: true,
		},

		carName: {
			type: {
				_id: false,
				id: {
					type: String,
					required: true,
				},
				vehicle: {
					type: String,
					required: true,
				},
			},
			required: true,
		},

		carModel: {
			type: {
				_id: false,
				id: {
					type: String,
					required: true,
				},
				model: {
					type: String,
					required: true,
				},
			},
			required: true,
		},

		carColor: {
			type: String,
		},

		carYear: {
			type: String,
			required: true,
		},

		boughtPrice: {
			type: Number,
		},

		client_id: {
			type: mongoose.SchemaTypes.ObjectId,
			ref: "Clients",
			required: true,
		},
		// vehicle_id: {
		// 	type: mongoose.SchemaTypes.ObjectId,
		// 	ref: "vehicles",
		// 	required: true,
		// },
	},
	{ timestamps: true }
);

const Deal = model("deals", DealSchema); //naming the table(document) in the data base

module.exports = Deal; //exporting the schema
