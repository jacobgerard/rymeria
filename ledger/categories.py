from . import dbmanager


def get_categories():
    return get_categories_all()


def get_categories_all():
    sql = (
        'SELECT * FROM categories '
    )
    database = dbmanager.getdb()
    dbcursor = dbmanager.getcursor(database)
    dbcursor.execute(sql)
    return [dict(row) for row in dbcursor.fetchall()]


def get_categories_active():
    sql = (
        'SELECT * FROM categories '
        'WHERE inactive = 0 '
    )
    database = dbmanager.getdb()
    dbcursor = dbmanager.getcursor(database)
    dbcursor.execute(sql)
    return [dict(row) for row in dbcursor.fetchall()]


def get_category_id(category):
    sql = (
        'SELECT id '
        'FROM categories '
        'WHERE category = (?) '
    )
    database = dbmanager.getdb()
    dbcursor = dbmanager.getcursor(database)
    dbcursor.execute(sql, (category,))
    return dbcursor.fetchall()[0][0]


def insert_category(cat, aorl, priority, inactive):
    sql = (
        'INSERT INTO categories '
        '(category, type, priority, inactive) '
        'VALUES '
    )
    sql += '((?), (?), (?), (?))'
    ina = 0
    if inactive:
        ina = 1
    database = dbmanager.getdb()
    dbcursor = dbmanager.getcursor(database)
    dbcursor.execute(sql, (cat, aorl, priority, ina))
    database.commit()


def update_category(catid, cat, aorl, priority, inactive):
    sql = (
        'UPDATE categories SET '
        'category = (?), '
        'type = (?), '
        'priority = (?), '
        'inactive = (?) '
        'WHERE id = (?) '
    )
    ina = 0
    if inactive:
        ina = 1
    database = dbmanager.getdb()
    dbcursor = dbmanager.getcursor(database)
    dbcursor.execute(sql, (cat, aorl, priority, ina, catid))
    database.commit()
