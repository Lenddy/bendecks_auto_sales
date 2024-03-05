const Vehicle = require("../../models/vehicle.model");
const { v4: uuidv4 } = require("uuid");
const pubsub = require("../pubsub");

// const { PubSub } = require("graphql-subscriptions");

// const pubsub = new PubSub();

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
		createOneVehicle: async (
			_,
			{ vehicleName, vehicleModels, years, colors, boughtPrice }
		) => {
			const createdAt = new Date().toISOString(); // Use toISOString() for custom DateTime scalar
			const updatedAt = new Date().toISOString(); // Use toISOString() for custom DateTime scalar
			//Date;

			vehicleModels = vehicleModels.map((modelDate) => {
				return {
					modelId: uuidv4(), // Generates a unique UUID
					...modelDate,
				};
			});

			years = years.map((yearDate) => {
				return {
					yearId: uuidv4(), // Generates a unique UUID
					...yearDate,
				};
			});

			colors = colors.map((colorDate) => {
				return {
					colorId: uuidv4(), // Generates a unique UUID
					...colorDate,
				};
			});
			return await Vehicle.create({
				vehicleName,
				vehicleModels,
				years,
				colors,
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
					// console.log(
					// 	"this is pubsub heerrrrrrreeeeeee: ",
					// 	pubsub._events
					// );

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
				vehicleModels,
				years,
				colors,
				boughtPrice,
				sellingPrice,
			} = args;

			const update = { updatedAt: new Date().toISOString() }; // Use toISOString() for custom DateTime

			if (vehicleName !== undefined) {
				update.vehicleName = vehicleName;
			}

			if (boughtPrice !== undefined) {
				update.boughtPrice = boughtPrice;
			}

			if (vehicleModels !== undefined && vehicleModels.length > 0) {
				const bulkOps = [];
				// ! find out why the models are not be updated

				for (const model of vehicleModels) {
					if (model.status === "add") {
						const newModel = {
							modelId: uuidv4(),
							model: model.model,
						};

						bulkOps.push({
							updateOne: {
								filter: { _id: id },
								update: {
									$push: { vehicleModels: newModel },
								},
							},
						});
					} else if (model.status === "update") {
						bulkOps.push({
							updateOne: {
								filter: {
									_id: id,
									"vehicleModels.modelId": model.modelId,
								},

								update: {
									$set: {
										"vehicleModels.$.model": model.model,
									},
								},
							},
						});
					} else if (model.status === "delete") {
						// If status is delete, push delete operation
						bulkOps.push({
							updateOne: {
								filter: {
									_id: id,
									"vehicleModels.modelId": model.modelId,
								},

								update: {
									$pull: {
										vehicleModels: {
											modelId: model.modelId,
										},
									},
								},
							},
						});
					}
				}

				// Execute all bulk operations together
				if (bulkOps.length > 0) {
					await Vehicle.bulkWrite(bulkOps);
				}
			}

			if (years !== undefined && years.length > 0) {
				const bulkOps = [];

				for (const year of years) {
					if (year.status === "add") {
						const newYear = {
							yearId: uuidv4(),
							year: year.year,
						};

						bulkOps.push({
							updateOne: {
								filter: { _id: id },
								update: {
									$push: {
										years: newYear,
									},
								},
							},
						});
					} else if (year.status === "update") {
						bulkOps.push({
							updateOne: {
								filter: {
									_id: id,
									"years.yearId": year.yearId,
								},

								update: {
									$set: {
										"years.$.year": year.year,
									},
								},
							},
						});
					} else if (year.status === "delete") {
						// If status is delete, push delete operation
						bulkOps.push({
							updateOne: {
								filter: {
									_id: id,
									"years.yearId": year.yearId,
								},

								update: {
									$pull: {
										years: {
											yearId: year.yearId,
										},
									},
								},
							},
						});
					}
				}

				// Execute all bulk operations together
				if (bulkOps.length > 0) {
					await Vehicle.bulkWrite(bulkOps);
				}
			}

			if (colors !== undefined && colors.length > 0) {
				const bulkOps = [];

				for (const color of colors) {
					if (color.status === "add") {
						const newColor = {
							colorId: uuidv4(),
							color: color.color,
						};

						bulkOps.push({
							updateOne: {
								filter: { _id: id },
								update: {
									$push: {
										colors: newColor,
									},
								},
							},
						});
					} else if (color.status === "update") {
						bulkOps.push({
							updateOne: {
								filter: {
									_id: id,
									"colors.colorId": color.colorId,
								},

								update: {
									$set: {
										"colors.$.color": color.color,
									},
								},
							},
						});
					} else if (color.status === "delete") {
						// If status is delete, push delete operation
						bulkOps.push({
							updateOne: {
								filter: {
									_id: id,
									"colors.colorId": color.colorId,
								},

								update: {
									$pull: {
										colors: {
											colorId: color.colorId,
										},
									},
								},
							},
						});
					}
				}

				// Execute all bulk operations together
				if (bulkOps.length > 0) {
					await Vehicle.bulkWrite(bulkOps);
				}
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
					// "CLIENT_ADDED",
					// "CLIENT_UPDATED",
					// "CLIENT_DELETED",
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
