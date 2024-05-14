from flask import Flask, request, jsonify
from flask_restful import Resource, Api
from flask_cors import CORS
from config import Genres

import database
import NetflixAPI

app = Flask(__name__)
api = Api(app)

CLIENT_ADDRESS = "http://localhost:3000"
CORS(app, origins=CLIENT_ADDRESS, supports_credentials=True, methods=["GET", "POST"])

@app.route('/api/genres', methods=['GET'])
def GetGenres():

    genres = []

    for genre, code in Genres.items():
        genres.append(genre)

    return {"genres": genres, "status": "success"}

@app.route('/api/session/<session_code>', methods=['GET'])
def GetSession(session_code):
    return {"session":database.GetSession(session_code)}

@app.route('/api/get_user_compleation_status', methods=["POST"])
def GetUserCompleationStatus():
    user_code = request.json["user_code"]
    session_code = request.json["session_code"]

    return {"status": database.GetUserCompleationStatus(user_code, session_code)}

@app.route("/api/get_completed_user_count/<session_code>", methods=['GET'])
def GetCompletedUserCount(session_code):
    return jsonify(database.GetCompletedUserCount(session_code))

@app.route("/api/sessions", methods=['GET'])
def GetSessions():
    if request.method == 'GET':
        return {"status": "success", "sessions": database.GetSessions()}

@app.route('/api/create_session', methods=['POST'])
def InsertSession():
    session = {
        "user_code": request.json['user_code'],
        "session_name": request.json['session_name'],
        "genres": request.json['genres'], # genre names
        "movie_count": request.json['movie_count'],
        "creation_time": request.json['creation_time'],
        "min_imdb": request.json['min_imdb'],
        "max_imdb": request.json['max_imdb'],
        "min_year": request.json['min_year'],
        "max_year": request.json['max_year'],
        "admin": request.json['admin'],
        "type": request.json['type']
    }

    Session_Movies_Response = NetflixAPI.GetMoviesByFilter(genres=session['genres'], _type=session["type"], limit=session['movie_count'], start_rating=session['min_imdb'], end_rating=session["max_imdb"], start_year=session['min_year'], end_year=session['max_year'])
    Session_Movies = []

    for movie in Session_Movies_Response:
        Session_Movies.append({
            "title": movie['title'],
            "movie_id": movie["id"],
            "imdbrating": movie["imdbrating"],
            "imgurl": movie["img"],
            "posterurl": movie["poster"],
            "netflixid": movie["nfid"],
            "runtime": movie["runtime"],
            "vtype": movie["vtype"],
            "year": movie["year"],
        })

    session['movies'] = Session_Movies

    return {"session_code": database.InsertSession(session), "status": "success"}

@app.route("/api/get_session_ranking/<session_code>", methods=['GET'])
def GetSessionRanking(session_code):
    try:
        return {"status": "success", "ranking": database.GetSessionRanking(session_code)}
    except:
        return {"status": "failed"}

@app.route("/api/get_session_movies/<session_code>", methods=['GET'])
def GetSessionMovies(session_code):
    return {"status": "success", "movies": database.GetSessionMovies(session_code)}

@app.route("/api/get_user_ranking", methods=['POST'])
def GetUserRanking():
    try:
        user_code = request.json["user_code"]
        session_code = request.json["session_code"]

        return {"status": "success", "ranking": database.GetUserRanking(user_code, session_code)}
    except:
        return {"status": "failed"}

@app.route('/api/insert_user_selections', methods=['POST'])
def InsertUserSelections():
    user_code = request.json['user_code']
    session_code = request.json['session_code']
    user_selections = list(request.json['selections']), # movie_id, movie_title, score, creation_time

    compleation_status = database.CompleteSession(user_code, session_code)

    if(compleation_status == "success"):
        return {"status": database.InsertUserSelections(user_code, session_code, user_selections)}

@app.route('/api/create_user_code', methods=['GET'])
def CreateUserCode():
    try:
        code, creation_time = database.CreateUserCode()
        return {"status": "success", "user_code": code, "creation_time": creation_time}
    except:
        return {"status": "error"}

if __name__ == "__main__":
    app.run(debug=True, port=5050, host="0.0.0.0")
          
