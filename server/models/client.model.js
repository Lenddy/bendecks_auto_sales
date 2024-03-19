//importing Schema and model to create the schema and saving it to the data base
const { Schema, model } = require("mongoose");

const ClientSchema = new Schema(
	{
		//attributes for the data base
		clientName: {
			type: String,
			required: true,
			min: [2, "Name Of The Client Must Be At Least 2 Characters Long"],
		},

		clientLastName: {
			type: String,
			required: true,
			min: [
				2,
				"Last Name Of The Client Must Be At Least 2 Characters Long",
			],
		},

		cellPhones: {
			type: [Object],
			required: true,
			// min: [1, "Model Of The Vehicle Must Be At Least 1 Character Long"],
		},
	},
	{ timestamps: true }
);

const Client = model("Clients", ClientSchema); //naming the table(document) in the data base

module.exports = Client; //exporting the schema
