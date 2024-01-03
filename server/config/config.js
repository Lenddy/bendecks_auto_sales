const { mongoose } = require("mongoose");
require("dotenv").config();

//to connect to mongoDb(data base)
mongoose.set("strictQuery", true); // this is so that only the field that you create are adde to your schema(document) and so you dont hve a warning
mongoose
	.connect(
		`mongodb+srv://Lenddy10:${process.env.Password}@mern.hrxjj7q.mongodb.net/${process.env.db}?retryWrites=true&w=majority`
	)
	.then(() => console.log("Established a connection to the database"))
	.catch((err) =>
		console.log(
			"Something went wrong when connecting to the database ",
			err
		)
	);
