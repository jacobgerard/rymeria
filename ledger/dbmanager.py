import sqlite3


config = '/sqlite/simple.db'


def getdb():
    con = sqlite3.connect(config, detect_types=sqlite3.PARSE_DECLTYPES)
    con.row_factory = sqlite3.Row
    return con


def getcursor(database):
    return database.cursor()


def dbconn(func):
    def wrapper(*args, **kwargs):
        conn = getdb()
        try:
            result = func(conn, *args, **kwargs)
        finally:
            conn.close()
        return result
    return wrapper
