import os
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.realpath(__file__))))
from Preprocess import Helper as Preprocess
import requests

# function which checks to make sure every word in the query exists in the list of key words from a product
def MatchKeyWords(query_key_words, key_words):
    matches = 0
    for keyword in query_key_words:
        if keyword in key_words:
            matches += 1
    return matches == len(query_key_words)

if __name__ == '__main__':
    # use API to retrieve documents, because there's too many records in database to pass as an argument
    Products = requests.get("http://localhost:5000/Api/RetrieveDocuments").json()["Documents"]
    
    # tokenzie, normalize, lemmatize the search query
    Query = Preprocess().RetProcessedTokens(sys.argv[1])
    Results = []
    for product in Products:
        if MatchKeyWords(Query, product["KeyWords"]):
            del product["KeyWords"]
            Results.append(product)
    # Print all products that meet the conditions so that it can be read on backend
    print(Results)