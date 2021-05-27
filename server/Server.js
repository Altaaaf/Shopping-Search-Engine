const express = require('express');
const cors = require('cors');
const DatabaseConnection = require('./Database/Connection');
const helmet = require('helmet');
const app = express();

// Connect to Mongo DB
DatabaseConnection();

app.use(helmet());
app.enable('trust proxy', 1);
app.use(cors());
app.use(express.json());
app.use('/Api', require('./Routes/Data'));

app.get('*', (req, res) => {
	res.status(200).json({ msg: 'Server is up and running...' });
});

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Listening on port ${port}`));
