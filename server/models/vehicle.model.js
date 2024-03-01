//importing Schema and model to create the schema and saving it to the data base
const { Schema, model } = require("mongoose");

const VehicleSchema = new Schema(
	{
		//attributes for the data base
		vehicleName: {
			type: String,
			required: true,
			min: [1, "Name Of The Vehicle Must Be At Least 1 Characters Long"],
		},

		vehicleModels: {
			type: [Object],
		},

		years: {
			type: [Object],
		},

		colors: {
			type: [Object],
		},

		boughtPrice: {
			type: Number,
			// required:true
		},
	},
	{ timestamps: true }
);

const Vehicle = model("vehicles", VehicleSchema); //naming the table(document) in the data base

module.exports = Vehicle; //exporting the schema
