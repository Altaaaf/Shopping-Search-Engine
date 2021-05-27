const mongoose = require('mongoose');
require('dotenv/config');

//Asynchronously connect to Mongo DB
//Read coneection url from .env

const ConnectMongo = async () => {
	try {
		await mongoose.connect(process.env.DB_CONNECTION, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useFindAndModify: false,
		});
		console.log('Successfully connected to mongo database');
	} catch (err) {
		//console.log(err);
		console.error('Failed to connect to mongo database');
		process.exit(1);
	}
};
module.exports = ConnectMongo;
