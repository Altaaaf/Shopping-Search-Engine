const express = require('express');
const Product = require('../Database/Models/Product');
const router = express.Router();
const { spawn } = require('child_process');
var stringSimilarity = require('string-similarity');

const merge = (arr1, arr2, attribute) => {
	let sorted = [];

	while (arr1.length && arr2.length) {
		if (arr1[0]['Item'][attribute.toString()] < arr2[0]['Item'][attribute.toString()]) {
			sorted.push(arr1.shift());
		} else sorted.push(arr2.shift());
	}

	return sorted.concat(arr1.slice().concat(arr2.slice()));
};
const mergeSort = (arr, attribute) => {
	if (arr.length <= 1) return arr;
	let mid = Math.floor(arr.length / 2),
		left = mergeSort(arr.slice(0, mid), attribute),
		right = mergeSort(arr.slice(mid), attribute);

	return merge(left, right, attribute.toString());
};

router.get('/RetrieveDocuments', async (req, res) => {
	try {
		return res.status(200).json({
			Documents: await Product.find({}, { _id: 0 }),
		});
	} catch (err) {
		console.log(err);
		return res.status(500).json({ status: 'Server Error!' });
	}
});
router.post('/BooleanRetrievalQuery', async (req, res) => {
	try {
		const { SearchQuery, PriceFilter } = req.body;

		if (SearchQuery === null || SearchQuery === undefined || SearchQuery.length === 0) {
			return res.status(400).json({
				status: 'Please enter a search query!',
			});
		}

		// the python sript that is being referenced (Preprocess.py) is used to tokenize, normalize, and lemmatize the args that are passed
		const PythonScript = spawn('python', ['BooleanRetrieval.py', SearchQuery]);

		// event when data from script is received
		PythonScript.stdout.on('data', function (data) {
			// Transform an array that has type string to type array
			var SEARCH_RESULTS = JSON.parse(data.toString().trim().replace(/'/g, '"'));
			if (PriceFilter) {
				SEARCH_RESULTS = mergeSort(SEARCH_RESULTS, 'Price');
			}
			return res.status(200).json({ SEARCH_RESULTS: SEARCH_RESULTS });
		});
		// event when error occurs in python boolean retrieval script
		PythonScript.stderr.on('data', function (data) {
			console.log('err' + data);
			return res.status(400).json({ status: 'Internal server failure when running search query' });
		});
		// event when the python script is finished executing and closes
		PythonScript.on('close', (code) => {
			// Code 0 represents successful execution with no error
			console.log(`Python script closed with code: ${code}`);
		});
	} catch (err) {
		console.log(err);
		return res.status(500).json({ status: 'Server Error!' });
	}
});
router.post('/VectorSpaceModelQuery', async (req, res) => {
	try {
		const { SearchQuery, PriceFilter, SimilarityFilter } = req.body;

		if (SearchQuery === null || SearchQuery === undefined || SearchQuery.length === 0) {
			return res.status(400).json({
				status: 'Please enter a search query!',
			});
		}

		const PythonScript = spawn('python', ['VectorSpaceModel.py', SearchQuery]);

		PythonScript.stdout.on('data', function (data) {
			// Transform an array that has type string to type array
			var SEARCH_RESULTS = JSON.parse(data.toString().trim().replace(/'/g, '"'));
			if (SimilarityFilter) {
				SEARCH_RESULTS = mergeSort(SEARCH_RESULTS, 'SIMILARITY').reverse();
			} else if (PriceFilter) {
				SEARCH_RESULTS = mergeSort(SEARCH_RESULTS, 'Price');
			}
			return res.status(200).json({ SEARCH_RESULTS: SEARCH_RESULTS });
		});
		// event when error occurs in python vector space model script
		PythonScript.stderr.on('data', function (data) {
			console.log('err' + data);
			return res.status(400).json({ status: 'Internal server failure when running search query' });
		});
		// event when the python script is finished executing and closes
		PythonScript.on('close', (code) => {
			// Code 0 represents successful execution with no error
			console.log(`Python script closed with code: ${code}`);
		});
	} catch (err) {
		console.log(err);
		return res.status(500).json({ status: 'Server Error!' });
	}
});

router.post('/Insert', async (req, res) => {
	try {
		// Set minimum thresholds / instantiate vars
		let MINIMUM_AVERAGE_SIMILARITY = 80;
		let MOST_SIMILAR_RECORD_ID = null;

		const { KeyWords, Listing } = req.body;

		const RECORDS = await Product.find();

		// Iterate over every document in database
		for (var CURRENT_RECORD = 0; CURRENT_RECORD < RECORDS.length; CURRENT_RECORD++) {
			// Keep track of current record keyword, id, and similarity which will be used to calculate average
			const CURRENT_RECORD_KEYWORDS = RECORDS[CURRENT_RECORD].KeyWords;
			const CURRENT_RECORD_ID = RECORDS[CURRENT_RECORD]._id;
			let CURRENT_SIMILARITY = 0;

			// Compute the similarity for every key word that was sent in request with that of the keywords inside current record
			for (var KEY_WORD = 0; KEY_WORD < KeyWords.length; KEY_WORD++) {
				const BEST_MATCH_RATING = stringSimilarity.findBestMatch(
					KeyWords[KEY_WORD],
					CURRENT_RECORD_KEYWORDS,
				).bestMatch.rating;

				CURRENT_SIMILARITY += BEST_MATCH_RATING;
			}
			const CURRENT_AVERAGE_SIMILARITY = 100 * (CURRENT_SIMILARITY / KeyWords.length);
			// Check to see if the average similarity of the request keywords for this record is greater than the stored values
			// Which would mean that the keywords for this record are more similar than previously checked
			if (CURRENT_AVERAGE_SIMILARITY > MINIMUM_AVERAGE_SIMILARITY) {
				MINIMUM_AVERAGE_SIMILARITY = CURRENT_AVERAGE_SIMILARITY;
				MOST_SIMILAR_RECORD_ID = CURRENT_RECORD_ID;
			}
		}
		if (MOST_SIMILAR_RECORD_ID !== null) {
			// validate that the record that is going to be added is unique
			// Match similarities between title
			// Any match with >= 0.90 means that they are very similar

			const MOST_SIMILAR_RECORD = await Product.findOne({ _id: MOST_SIMILAR_RECORD_ID });
			const COMPARE_TITLES = stringSimilarity.compareTwoStrings(
				MOST_SIMILAR_RECORD.Item.Title,
				Listing.Title,
			);
			if (COMPARE_TITLES >= 0.9) {
				return res.status(400).json({
					status:
						'Product is too similar to existing records so not creating a record for this item!',
					Title: Listing.Title,
					ExistingRecordTitle: MOST_SIMILAR_RECORD.Item.Title,
				});
			}
		}
		const createNewListing = new Product({
			KeyWords: KeyWords,
			Item: Listing,
		});
		createNewListing.save();
		return res.status(200).json({
			status: 'Successfully created a new record for this listing!',
			KeyWords: KeyWords,
		});
	} catch (err) {
		console.log(err);
		return res.status(500).json({ status: 'Server Error!' });
	}
});

module.exports = router;
