const { GraphQLScalarType, Kind } = require("graphql");

module.exports = {
	DateTime: new GraphQLScalarType({
		name: "DateTime",
		description: "scalar type for setting the date and the time",
		// parseValue and parseLiteral are use to get values from the request
		parseValue(val) {
			return new Date(val);
		},
		parseLiteral(ast) {
			if (ast.kind === Kind.INT) {
				return parseInt(ast.value, 10);
			}
			return null;
		},
		// use to sent value as a response
		serialize(val) {
			const date = new Date(val);
			return date.toISOString(); // Fix typo: Change 'DataTransfer' to 'date'
		},
	}),
};
