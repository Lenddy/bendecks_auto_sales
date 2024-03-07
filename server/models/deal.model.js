//importing Schema and model to create the schema and saving it to the data base
const { Schema, model, mongoose } = require("mongoose");

const DealSchema = new Schema(
	{
		//attributes for the data base
		downPayment: {
			type: Number,
			required: true,
			// min: [1, "Name Of The Vehicle Must Be At Least 1 Characters Long"],
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

		paymentDates: {
			type: Array,
			required: true,
		},

		sellingPrice: {
			type: Number,
			required: true,
		},

		remainingBalance: {
			type: Number,
		},

		carName: {
			type: String,
			required: true,
		},

		carModel: {
			type: String,
			required: true,
		},

		carColor: {
			type: String,
		},

		carYear: {
			type: Object,
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
