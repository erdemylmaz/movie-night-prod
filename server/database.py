import mysql.connector
import time
import random
from config import password

db = mysql.connector.connect(
        user='root',
        password=password,
        host='localhost',
        database='movie-picker'
        )

cursor = db.cursor()

def CreateTables():
    cursor.execute("CREATE TABLE Session (session_code VARCHAR(255), session_name VARCHAR(255), movie_count smallint, min_imdb float, min_year int, creation_time bigint, admin VARCHAR(255), PRIMARY KEY(session_code))")

    cursor.execute("CREATE TABLE Session_Movie (session_code VARCHAR(255), title VARCHAR(255), movie_id int, imdbrating float, imgurl VARCHAR(511), posterurl VARCHAR(511), netflixid int, runtime int, vtype VARCHAR(255), year int,  PRIMARY KEY(session_code, movie_id))")

    cursor.execute("CREATE TABLE User (user_id VARCHAR(255), creation_time bigint, PRIMARY KEY(user_id))")
    cursor.execute("CREATE TABLE Session_Movie (session_code VARCHAR(255), title VARCHAR(255), movie_id int, imdbrating float, imgurl VARCHAR(255), posterurl VARCHAR(255), netflixid int, runtime int, vtype VARCHAR(255), year int,  PRIMARY KEY(session_code, movie_id))")

    cursor.execute("CREATE TABLE User_Selection (user_id VARCHAR(255), session_code VARCHAR(255), movie_id int, movie_title VARCHAR(255), score smallint, creation_time bigint, selection_id int AUTO_INCREMENT, PRIMARY KEY(selection_id))")
    cursor.execute("CREATE TABLE Session_Category (session_code VARCHAR(255), category VARCHAR(255), category_id int AUTO_INCREMENT, PRIMARY KEY(category_id))")

def GetUserAdminSessions(user_id):
    cursor.execute("SELECT session_code FROM Session WHERE admin = %s", (user_id,))

    sessions = cursor.fetchall()

    if sessions is None:
        return None
    return list(sessions)

def GetSessions():
    cursor.execute("SELECT session_code FROM Session")

    sessions = cursor.fetchall()

    sessions_list = [session[0] for session in sessions]

    return sessions_list

def GetSessionCategories(session_code):
    cursor.execute("SELECT category FROM Session_Category WHERE session_code = %s", (session_code,))

    categories = cursor.fetchall()

    return [category[0] for category in categories]

def GetSessionMovies(session_code):
    cursor.execute("SELECT * FROM Session_Movie WHERE session_code = %s", (session_code,))

    response = cursor.fetchall()

    movies = []
    
    for movie in response:
        movie = {
                "title": movie[1],
                "movie_id": movie[2],
                "imdbrating": movie[3],
                "imgurl": movie[4],
                "netflixid": movie[6],
                "runtime": movie[7],
                "vtype": movie[8],
                "year": movie[9]
                }
        movies.append(movie)

    return movies

def GetSession(session_code):
    cursor.execute("SELECT * FROM Session WHERE session_code = %s", (session_code,))
    
    response = cursor.fetchall()

    session = {
        "session_code": session_code,
        "categories": GetSessionCategories(session_code),
        "movies": GetSessionMovies(session_code),
    }

    for data in response:
        session["name"] = data[1]
        session["movie_count"] = data[2]
        session["creation_time"] = data[5]
        session["admin"] = data[6]

    return session

def GetUserIDs(session_code):
    cursor.execute("SELECT user_id FROM User_Selection WHERE session_code = %s", (session_code,))

    users = cursor.fetchall()

    return list(users)
# GetUserRanking => this would calculate in locally

def GetSessionRanking(session_code):
    cursor.execute("SELECT * FROM User_Selection WHERE session_code = %s", (session_code,))

    response = cursor.fetchall() 

    movies = {}

    for data in response:
        movies.setdefault(data[2], 0)
        movies[data[2]] += data[4]

    output = []

    for movie_id, score in movies.items():
        output.append({"movie_id": movie_id, "score": score})

    return sorted(output, key=lambda x: x["score"])

def GetUserRanking(user_code, session_code):
    cursor.execute("SELECT * FROM User_Selection WHERE user_id = %s AND session_code = %s", (user_code, session_code))

    selections = list(cursor.fetchall())

    selections = sorted(selections, key=lambda x: x[4], reverse=True)

    ranking = []

    for selection in selections:
        ranking.append({
            "title": selection[3],
            "score": selection[4],
            })

    return ranking

GetUserRanking("qtrz@!xX7$BIPZo4AAN0*ttr$qvBQx3RID_QV!_#dmeGHLAmOrZ^EIBT%Kb+LT3m", "mtfvulkp")

def CreateUserCode():
    letters  = "abcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*_+ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    CODE_LENGTH = 64 
    
    code = ""

    for i in range(CODE_LENGTH):
        code += letters[random.randint(0, len(letters) - 1)]

    creation_time = int(time.time())

    cursor.execute("INSERT INTO User (user_id, creation_time) VALUES (%s, %s)", (code, creation_time))
    db.commit()

    return code, creation_time

def CreateSessionCode():
    letters = "abcdefghijklmnopqrstuvwxyz0123456789"
    CODE_LENGTH = 8

    is_unique = False

    while not is_unique:
        code = ""

        for i in range(CODE_LENGTH):
            code += letters[random.randint(0, len(letters) - 1)]

        cursor.execute("SELECT * FROM Session WHERE session_code = %s", (code,))
        if cursor.fetchone() is None:
            is_unique = True
    
    return code

def InsertSession(session):
    session["session_code"] = CreateSessionCode()

    cursor.execute("INSERT INTO Session (session_code, session_name, movie_count, min_imdb, min_year, creation_time, admin) VALUES (%s, %s, %s, %s, %s, %s, %s)", (session["session_code"], session["session_name"], session["movie_count"], session["min_imdb"], session["min_year"], session["creation_time"], session["admin"]))

    for category in session["genres"]:
        cursor.execute("INSERT INTO Session_Category (session_code, category) VALUES (%s, %s)", (session["session_code"], category))

    for movie in session["movies"]:
        print("imgurl:", movie["imgurl"])
        print("posterurl:", movie["posterurl"])

        if movie["imgurl"] == "":
            movie["imgurl"] = "None"
        if movie["posterurl"] == "":
            movie["posterurl"] = "None"

        cursor.execute("INSERT INTO Session_Movie (session_code, title, movie_id, imdbrating, imgurl, posterurl, netflixid, runtime, vtype, year) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)", (session["session_code"], movie["title"], movie["movie_id"], movie["imdbrating"], movie["imgurl"] or "None", movie["posterurl"] or "None", movie["netflixid"], movie["runtime"], movie["vtype"], movie["year"]))

    db.commit()

    return session["session_code"]

def CompleteSession(user_code, session_code):
    try:
        cursor.execute("INSERT INTO User_Completed_Session (user_code, session_code, complete_time) VALUES (%s, %s, %s)", (user_code, session_code, time.time()))
        db.commit()
        return "success"
    except:
        return "failed"

def GetUserCompleationStatus(user_code, session_code):
    cursor.execute("SELECT * FROM User_Completed_Session WHERE session_code = %s AND user_code = %s", (session_code, user_code))

    result = cursor.fetchall()
    if(len(result) > 0):
        return "completed"
    else:
        return "not-completed"

def InsertUserSelections(user_id, session_code, selections):

    try:
        creation_time = time.time()

        for movie in selections[0]:
            cursor.execute("INSERT INTO User_Selection (user_id, session_code, movie_id, movie_title, score, creation_time) VALUES (%s, %s, %s, %s, %s, %s)", (user_id, session_code, movie["netflixid"], movie["title"], movie["score"], creation_time))
        db.commit()
        return "success"
    except:
        return "failed"

def GetCompletedUserCount(session_code):
    cursor.execute("SELECT COUNT(DISTINCT user_id) FROM User_Selection WHERE session_code = %s", (session_code,))

    return cursor.fetchone()[0]

