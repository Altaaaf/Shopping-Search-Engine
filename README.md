# Shopping-Filtering-System
A search engine for shopping websites using different information retrieval models and algorithms

---

# Models and algorithms implemented

## Boolean Retrieval Model

This model is a simple retrieval method that matches a query to documents if and only if all of the keywords in the query exist in the documents list of keywords

## Vector Space Model - Cosine Similarity

This model represents both search queries and documents as vectors of weights. The weights are used to represent the significance the query or document has which allows for documents to be ranked based on their relevancy to a search query. Documents are displayed in order of decreasing cosine similarity.

## Similarity Matching using Dice's Coefficient

 Dice's coefficient is an algorithm which is used to measure the similarity between two strings. The implementation of this algorithm was similar to the boolean retrieval model in that the keywords of a search query are compared with the keywords of a document. If their similarity was greater than a minimum threshold (80% similar) it was classified as a relevant document. This is different than the boolean retrieval model because even if a document isn't an exact match for the keywords, it can still have some relevance. Wheras, for the boolean retrieval model, documents are either relevant or not.

---

# Technologies used:
* Backend - Node Js, Express
* Frontend - React Js
* Database - MongoDB


## Get Started

Prerequisites:

* Install Node.js version 14.15.1
* Install Visual Studio Code
* Clone the GitHub Repository.(https://github.com/Altaaaf/Shopping-Filtering-System)
* run npm install if first time

> Starting backend, open a new terminal in visual studio code
```
cd client
npm start
```

> Starting Front end, open a new terminal in visual studio code
```
cd server
nodemon server.js
```

## API

| Endpoint | Method(s) | Description |
| :--- | :--- | :--- |
| /Api/RetrieveDocuments | GET | Retrieve all existing products from database |
| /Api/BooleanRetrievalQuery | POST | Executes Boolean Retrieval Model based on a search query |
| /Api/VectorSpaceModelQuery | POST | Executes Vector Space model based on a search query  |
| /Api/Insert | POST | Insert a product into database if and only if there is no similar product to the one being inserted, which is validated using dices coefficient  |

<br>
