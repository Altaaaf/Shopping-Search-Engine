import requests
import threading
import os, sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.realpath(__file__))))
from Preprocess import Helper as Preprocess

class EtsyWrapper:
    def __init__(self):
        self.API_KEY = "oef1mnjd0prcj3haibliuhwt"
        self.RAPID_API_KEY = "d8670b4d69msh8d7dfa26d8b35b3p1e76fajsn11ae066c92db"
        self.RAPID_API_HOST = "community-etsy.p.rapidapi.com"
        self.HEADERS = {'x-rapidapi-key': self.RAPID_API_KEY, 'x-rapidapi-host': self.RAPID_API_HOST}
        self.PARAMS = { 'api_key': self.API_KEY}
    def GetActiveListings(self):
        return requests.get("https://community-etsy.p.rapidapi.com/listings/active", headers=self.HEADERS, params=self.PARAMS).json()["results"]
    def GetTrendingListings(self):
        return requests.get("https://community-etsy.p.rapidapi.com/listings/trending", headers=self.HEADERS, params=self.PARAMS).json()["results"]
    def GetInterestingListings(self):
        return requests.get("https://community-etsy.p.rapidapi.com/listings/interesting", headers=self.HEADERS, params=self.PARAMS).json()["results"]
    def GetAllCurrentFeaturedListings(self):
        return requests.get("https://community-etsy.p.rapidapi.com/featured_treasuries/listings/homepage_current", headers=self.HEADERS, params=self.PARAMS).json()["results"]
    def GetAll(self):
        return self.GetActiveListings() + self.GetTrendingListings() + self.GetInterestingListings() + self.GetAllCurrentFeaturedListings()
def hasRequiredKeys(Listing):
    KEYS = [
            "title",
            "price",
            "currency_code",
            "quantity",
            "description",
            "url"
            ]
    for key in KEYS:
        if not key in Listing:
            return False
    return True
def ProcessListings(data):
    for product in data:
        if hasRequiredKeys(product):
            postRequest = {
                "KeyWords": [],
                "Listing":{
                    "Title": product["title"],
                    "Price": product["price"],
                    "Currency": product["currency_code"],
                    "Quantity": product["quantity"],
                    "PurchaseURL": product["url"]
                }
            }
            postRequest["KeyWords"] = Processor.RetProcessedTokens(postRequest["Listing"]["Title"])
            
            print(requests.post("http://localhost:5000/Api/Insert", json=postRequest).json(), flush=True)

if __name__ == '__main__':
    Etsy = EtsyWrapper()
    Processor = Preprocess()

    # create a thread for each of the apis to scrape
    threads = [
        threading.Thread(target=ProcessListings, args=(Etsy.GetActiveListings(),)),
        threading.Thread(target=ProcessListings, args=(Etsy.GetTrendingListings(),)),
        threading.Thread(target=ProcessListings, args=(Etsy.GetInterestingListings(),)),
        threading.Thread(target=ProcessListings, args=(Etsy.GetAllCurrentFeaturedListings(),))
    ]

    for i in range(len(threads)):
        threads[i].daemon = True
        threads[i].start()
        threads[i].join()

    input("finished scraping... press any key to close...")