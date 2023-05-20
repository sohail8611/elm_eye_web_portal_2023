import mysql.connector

server = "185.230.211.145:1244"
# def db_connection():
#     host = 'localhost'
#     user = "root"
#     password = ""
#     database = 'elm'
#     cnx = mysql.connector.connect(host=host, user=user, password=password, database=database)
#     return cnx

def db_connection():
    host = '185.230.211.145'
    user = "lt"
    password = "V2@Cloud2022"
    database = 'elm'
    cnx = mysql.connector.connect(host=host, user=user, password=password, database=database)
    return cnx

