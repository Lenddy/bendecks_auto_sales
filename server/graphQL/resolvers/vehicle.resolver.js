const Vehicle = require("../../models/vehicle.model");
const { PubSub } = require("graphql-subscriptions");

const pubsub = new PubSub();

const vehicleResolvers = {
	Query: {
		hello: async () => {
			return "hello world";
		},
		getAllVehicles: async () => {
			return await Vehicle.find()
				.then((vehicles) => {
					console.log(
						"all the vehicles",
						vehicles,
						"\n____________________"
					);
					return vehicles;
				})
				.catch((err) => {
					console.log(
						"there was an error fetching all the vehicles",
						err,
						"\n____________________"
					);
					throw err;
				}); //gets all the vehicles(items) in the data base
		},
		getOneVehicle: async (_, { id }) => {
			return await Vehicle.findById(id)
				.then((vehicle) => {
					console.log(
						"one vehicle ",
						vehicle,
						"\n____________________"
					);
					return vehicle;
				})
				.catch((err) => {
					console.log(
						"there was an error fetching one vehicle",
						err,
						"\n____________________"
					);
					throw err;
				}); //gets one the vehicle(item) from the data base
		},
	},

	Mutation: {
		createOneVehicle: async (_, args) => {
			const { vehicleName, vehicleModel, year, color, boughtPrice } =
				args;
			const createdAt = new Date().toISOString(); // Use toISOString() for custom DateTime scalar
			const updatedAt = new Date().toISOString(); // Use toISOString() for custom DateTime scalar
			//Date;
			return await Vehicle.create({
				vehicleName,
				vehicleModel,
				year,
				color,
				color,
				boughtPrice,
				createdAt,
				updatedAt,
			})
				.then((newVehicle) => {
					pubsub.publish("VEHICLE_ADDED", {
						onVehicleChange: {
							eventType: "VEHICLE_ADDED",
							vehicleChanges: newVehicle,
						},
					});

					console.log(
						"new Vehicle created",
						newVehicle,
						"\n____________________"
					);
					return newVehicle;
				})
				.catch((err) => {
					console.log(
						"there was an error creating a new Vehicle",
						err,
						"\n____________________"
					);
					throw err;
				});
		},

		updateOneVehicle: async (parent, args, context, info) => {
			const {
				id,
				vehicleName,
				vehicleModel,
				year,
				color,
				boughtPrice,
				sellingPrice,
			} = args;
			const update = { updatedAt: new Date().toISOString() }; // Use toISOString() for custom DateTime

			if (vehicleName !== undefined) {
				update.vehicleName = vehicleName;
			}
			if (vehicleModel !== undefined) {
				update.vehicleModel = vehicleModel;
			}
			if (year !== undefined) {
				update.year = year;
			}
			if (color !== undefined) {
				update.color = color;
			}
			if (boughtPrice !== undefined) {
				update.boughtPrice = boughtPrice;
			}

			return await Vehicle.findByIdAndUpdate(id, update, {
				new: true,
			})
				.then((updatedVehicle) => {
					pubsub.publish("VEHICLE_UPDATED", {
						onVehicleChange: {
							eventType: "VEHICLE_UPDATED",
							vehicleChanges: updatedVehicle,
						},
					});
					console.log(
						"vehicle updated",
						updatedVehicle,
						"\n____________________"
					);
					return updatedVehicle;
				})
				.catch((err) => {
					console.log(
						"there was an error updating a vehicle",
						err,
						"\n____________________"
					);
					throw err;
				});
		},

		deleteOneVehicle: async (_, { id }) => {
			return await Vehicle.findByIdAndDelete(id)
				.then((deletedVehicle) => {
					pubsub.publish("VEHICLE_DELETED", {
						onVehicleChange: {
							eventType: "VEHICLE_DELETED",
							vehicleChanges: deletedVehicle,
						},
					});

					console.log(
						" a Vehicle was deleted",
						deletedVehicle,
						"\n____________________"
					);
					return deletedVehicle;
				})
				.catch((err) => {
					console.log(
						"there was an error deleting a Vehicle",
						err,
						"\n____________________"
					);
					throw err;
				});
		},
	},

	Subscription: {
		onVehicleChange: {
			subscribe: () =>
				pubsub.asyncIterator([
					"VEHICLE_ADDED",
					"VEHICLE_UPDATED",
					"VEHICLE_DELETED",
				]),
		},
	},

	Vehicle: {
		// Use toISOString() for custom DateTime scalar
		createdAt: (vehicle) => vehicle.createdAt.toISOString(),
		updatedAt: (vehicle) => vehicle.updatedAt.toISOString(),
	},
};

module.exports = { vehicleResolvers };
