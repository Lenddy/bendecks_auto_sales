//importing Schema and model to create the schema and saving it to the data base
const { Schema, model } = require("mongoose");

const ListSchema = new Schema(
	{
		//attributes for the data base
		title: {
			type: String,
			required: true,
			min: [3, "Title Must Be At Lest 3 Characters Long"],
		},

		description: {
			type: String,
			required: true,
			min: [5, "Description Must Be At Lest 5 Characters Long"],
		},
		isDone: {
			type: Boolean,
			default: false,
			required: true,
		},
	},
	{ timestamps: true }
);

const List = model("list", ListSchema); //naming the table(document) in the data base

module.exports = List; //exporting the schema
