from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import requests
import sys, os
sys.path.append(os.path.dirname(os.path.dirname(os.path.realpath(__file__))))
from Preprocess import Helper as Preprocess

if __name__ == '__main__':
    # use API to retrieve documents, because there's too many records in database to pass as an argument
    Products = requests.get("http://localhost:5000/Api/RetrieveDocuments").json()["Documents"]
    # receive the search query as an argument
    Query = sys.argv[1]

    # add all tokenized product titles to an array
    CORPUS = []
    for ArgumentItems in Products:
        PreprocessedTitle = ' '.join(ArgumentItems["KeyWords"]) # title is already preprocessed and stored in database
        ArgumentItems["PreprocessedTitle"] = PreprocessedTitle # Create a key to identify the tokenized version of title so it can later be found
        CORPUS.append(PreprocessedTitle)

    vectorizerX = TfidfVectorizer()
    vectorizerX.fit(CORPUS)
    # transform corpus array ( list of keywords which represents their respected product title) to vector
    document_vector = vectorizerX.transform(CORPUS)

    # tokenzie, normalize, lemmatize search query and then transform into a vector
    query_vector = vectorizerX.transform([' '.join(Preprocess().RetProcessedTokens(Query))])

    # compare the document vector with query vector
    cosineSimilarities = cosine_similarity(document_vector, query_vector) # returns an array of similarities for each document

    Records = [] # Array for all of the products that have >= 25% similarity

    for SimilaritiesIndex in range(len(cosineSimilarities)): # iterate over all similarities and see which have >= 25% similarity
        similarity_percent = 100 * cosineSimilarities[SimilaritiesIndex][0] # Similarity % for each document
        if similarity_percent >= 25: # Minimum threshold for each document to be displayed is 25% - aka minimum 25% similarity
            for products_ in Products: # find database record ID in map
                if "PreprocessedTitle" in products_:
                    if CORPUS[SimilaritiesIndex] == products_["PreprocessedTitle"]:
                        record_ = products_ #create local variable of the product so it's easier to modify
                        del record_["KeyWords"] #Preprocessed tokens retrieved from database
                        del record_["PreprocessedTitle"] # delete the previously added key 'PreprocessedTitle' which was used to identify this record
                        record_["Item"]["SIMILARITY"] = round((similarity_percent),2) # append the similarity percent for this record so it can be later used for sorting
                        Records.append(record_) # Append the database ID
                        break # once the record is found, break look and continue looping similarities
    print(Records) # Print to console so that it can be read from the parent process which is running this script on backend

