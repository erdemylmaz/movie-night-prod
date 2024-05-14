import requests
import random
from config import API_KEY, Genres

def GetGenresFromAPI():
    url = "https://unogsng.p.rapidapi.com/genres"

    headers = {
	    "X-RapidAPI-Key": API_KEY,
	    "X-RapidAPI-Host": "unogsng.p.rapidapi.com"
    }

    data = requests.get(url, headers=headers).json()

    return data

def GetMoviesByFilter(genres=None, _type=None, start_year=None, end_year=None, start_rating=None, end_rating=None, limit=None, offset=None):
    url = "https://unogsng.p.rapidapi.com/search"

    headers = {
	    "X-RapidAPI-Key": "0d7712bd58msh0a9dee061020e42p1b5043jsn73c41e3579bf",
	    "X-RapidAPI-Host": "unogsng.p.rapidapi.com"
    }

    querystring = {
            "countrylist": "78,432",
            }

    if _type != "all":
        querystring['type'] = _type

    # if there is a type, add it to the querystring
    if end_year:
        querystring['end_year'] = end_year

    if start_year:
        querystring['start_year'] = start_year

    if start_rating:
        querystring['start_rating'] = start_rating

    if end_rating:
        querystring['end_rating'] = end_rating

#    if limit:
#        querystring['limit'] = limit

    if offset:
        querystring['offset'] = offset

    # if there are genres, add them to the querystring
    if genres:
        genreList = ""

        for genreTitle in genres:
            genreId = Genres[genreTitle]
            genreList += genreId + ","

        genreList = genreList[:-1]

        querystring['genrelist'] = genreList

    # # # # # # 

    response = requests.get(url, headers=headers, params=querystring).json()

    # simpify data and make it more readable
    for data in response["results"]:
        data.pop("top250", None)
        data.pop("top250tv", None)
        data.pop("titledate", None)

    movieIndexes = []

    output = []

    for i in range(int(limit)):
        randomNumber = random.randint(0, len(response["results"]) - 1)
        while randomNumber in movieIndexes:
            randomNumber = random.randint(0, len(response["results"]) - 1)

        movieIndexes.append(randomNumber)
        output.append(response["results"][randomNumber])

    return output

def main():
    pass

if __name__ == "__main__":
    main()
