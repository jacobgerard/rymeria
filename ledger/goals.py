from . import dbmanager


def get_goals():
    sql = (
        'SELECT * FROM goals '
        'ORDER BY priority'
    )
    database = dbmanager.getdb()
    dbcursor = dbmanager.getcursor(database)
    dbcursor.execute(sql)
    return [dict(row) for row in dbcursor.fetchall()]


def get_goals_active():
    sql = (
        'SELECT * FROM goals '
        'WHERE inactive = 0 '
        'ORDER BY priority'
    )
    database = dbmanager.getdb()
    dbcursor = dbmanager.getcursor(database)
    dbcursor.execute(sql)
    return [dict(row) for row in dbcursor.fetchall()]


def new_goal(goal, priority, duedate):
    sql = (
        'INSERT INTO goals (goal, priority, due_date) '
        'VALUES '
        '((?), (?), (?))'
    )
    database = dbmanager.getdb()
    dbcursor = dbmanager.getcursor(database)
    dbcursor.execute(sql, (goal, priority, duedate))
    database.commit()
