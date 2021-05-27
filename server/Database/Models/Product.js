const mongoose = require('mongoose');

const Product = mongoose.Schema(
	{
		KeyWords: {
			type: Array,
			required: true,
		},
		Item: {
			type: Object,
			required: true,
		},
	},
	{ versionKey: false },
);

module.exports = mongoose.model('Product', Product);
