import nltk
from nltk import word_tokenize
from nltk.corpus import stopwords
import sys
# helper class which, tokenizes, lemmatize, normalizes and removes stop words
class Helper:
    def __init__(self):
        self.StopWords = set(stopwords.words('english'))
        self.PorterStemmer = nltk.PorterStemmer()
    def Tokenize(self, text):
        return word_tokenize(text)
    def RemoveNonAlphabeticalCharacters(self, input):
        return [w for w in input if w.isalpha()]
    def isUsefulToken(self, token):
        return len(str(token)) > 1 and token.count(token[0]) != len(str(token)) and not str(token) in self.StopWords
    def NormalizeAndStem(self, tokens):
        retList = []
        Tokens = self.RemoveNonAlphabeticalCharacters(tokens)
        for token in Tokens:
            if self.isUsefulToken(token):
                retList.append(self.PorterStemmer.stem(token.lower()))
        return sorted(set(retList))
    def RetProcessedTokens(self, text):
        return self.NormalizeAndStem(self.Tokenize(text))

if __name__ == '__main__':
    if len(sys.argv) > 1:
        print(Helper().RetProcessedTokens(sys.argv[1]))