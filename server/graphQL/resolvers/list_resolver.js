const List = require("../../models/list_todos.model");

const resolvers = {
	Query: {
		hello: async () => {
			return "hello world";
		},
		getAllLists: async () => {
			return await List.find(); //gets all the list(items) in the data base
		},
	},
	Mutation: {
		createOneList: async (_, args) => {
			const { title, description, isDone } = args.list;
			const createdAt = new Date().toISOString();
			const updatedAt = new Date().toISOString();
			//
			Date;
			return await List.create({
				title,
				description,
				isDone,
				createdAt,
				updatedAt,
			})
				.then((newList) => {
					console.log("new list created", newList);
					return newList;
				})
				.catch((err) => {
					console.log("there was an error creating a new list", err);
					throw err;
				});
		},

		// createOneList: async (_, { list }) => {
		// 	try {
		// 		const { title, description, isDone } = list;
		// 		const createdAt = new Date().toISOString();
		// 		const updatedAt = new Date().toISOString();

		// 		const newList = await List.create({
		// 			title,
		// 			description,
		// 			isDone,
		// 			createdAt,
		// 			updatedAt,
		// 		});

		// 		console.log("New list created", newList);
		// 		return newList;
		// 	} catch (err) {
		// 		console.log("There was an error creating a new list", err);
		// 		throw err; // Throw the error to be handled by Apollo Server
		// 	}
		// },
	},
};

module.exports = { resolvers };
