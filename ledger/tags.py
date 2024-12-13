from . import dbmanager


def get_tags():
    sql = (
        'SELECT * FROM tags '
    )
    database = dbmanager.getdb()
    dbcursor = dbmanager.getcursor(database)
    dbcursor.execute(sql)
    return [dict(row) for row in dbcursor.fetchall()]


def get_tags_active():
    sql = (
        'SELECT * FROM tags '
        'WHERE inactive = 0 '
    )
    database = dbmanager.getdb()
    dbcursor = dbmanager.getcursor(database)
    dbcursor.execute(sql)
    return [dict(row) for row in dbcursor.fetchall()]


def insert_tag(tag, inactive):
    sql = (
        'INSERT INTO tags '
        '(text, inactive) '
        'VALUES ((?), (?))'
    )
    ina = 0
    if inactive:
        ina = 1
    database = dbmanager.getdb()
    dbcursor = dbmanager.getcursor(database)
    dbcursor.execute(sql, (tag, ina))
    database.commit()


def update_tag(tagid, tag, inactive):
    sql = (
        'UPDATE tags SET '
        'text = (?), '
        'inactive = (?) '
        'WHERE id = (?) '
    )
    ina = 0
    if inactive:
        ina = 1
    database = dbmanager.getdb()
    dbcursor = dbmanager.getcursor(database)
    dbcursor.execute(sql, (tag, ina, tagid))
    database.commit()


def insert_expense_tag(expid, tagid):
    sql = (
        'INSERT INTO expense_tags '
        '(expense_id, tag_id) '
        'VALUES ((?), (?))'
    )
    database = dbmanager.getdb()
    dbcursor = dbmanager.getcursor(database)
    dbcursor.execute(sql, (expid, tagid))
    database.commit()


def get_expensetags(expid):
    sql = (
        'SELECT * FROM expense_tags '
        'WHERE expense_id = (?) '
    )
    database = dbmanager.getdb()
    dbcursor = dbmanager.getcursor(database)
    dbcursor.execute(sql, (expid, ))
    return [dict(row) for row in dbcursor.fetchall()]


def toggle_expensetags(tagid, expid):
    sql = (
        'SELECT * FROM expense_tags '
        'WHERE tag_id = (?) '
        'AND expense_id = (?) '
    )
    database = dbmanager.getdb()
    dbcursor = dbmanager.getcursor(database)
    dbcursor.execute(sql, (tagid, expid))
    result = [dict(row) for row in dbcursor.fetchall()]
    if len(result) > 0:
        sql = (
            'DELETE FROM expense_tags '
            'WHERE tag_id = (?) '
            'AND expense_id = (?) '
        )
    else:
        sql = (
            'INSERT INTO expense_tags '
            '(tag_id, expense_id) '
            'VALUES ((?), (?)) '
        )
    db = dbmanager.getdb()
    dbc = dbmanager.getcursor(db)
    dbc.execute(sql, (tagid, expid))
    db.commit()
