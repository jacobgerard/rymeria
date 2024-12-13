from . import categories
from . import dbmanager
from .money import *


def get_budget(period):
    sql = (
        'SELECT budgets.id, categories.category, budgets.amount '
        'FROM budgets '
        'INNER JOIN categories '
        'ON budgets.category_id = categories.id '
        'WHERE strftime("%Y-%m", date) = (?) '
        'ORDER BY categories.priority '
    )
    database = dbmanager.getdb()
    dbcursor = dbmanager.getcursor(database)
    dbcursor.execute(sql, (period,))
    return [dict(row) for row in dbcursor.fetchall()]


def get_budget_income(begin, end):
    sql = (
        'SELECT SUM(amount) AS amount '
        'FROM budgets '
        'WHERE date BETWEEN (?) AND (?) '
    )
    database = dbmanager.getdb()
    dbcursor = dbmanager.getcursor(database)
    dbcursor.execute(sql, (begin, end))
    return dbcursor.fetchall()[0]['amount']


def update_budget(sqlid, amount):
    sql = (
        'UPDATE budgets SET '
        'amount = (?) '
        'WHERE id = (?) '
    )
    amt = dollars_to_cents(amount)
    database = dbmanager.getdb()
    dbcursor = dbmanager.getcursor(database)
    dbcursor.execute(sql, (amt, sqlid))
    database.commit()


def insert_budget(year, month, category, amount):
    catid = categories.get_category_id(category)
    sql = (
        'UPDATE budgets '
        'SET amount = (?) '
        'WHERE strftime("%Y", date) = (?) AND strftime("%m", date) = (?) '
        'AND category_id = (?) '
    )
    database = dbmanager.getdb()
    dbcursor = dbmanager.getcursor(database)
    dbcursor.execute(sql, (str(amount), str(year), str(month).zfill(2), str(catid)))
    database.commit()


def generate_budget(year, month):
    database = dbmanager.getdb()
    dbcursor = dbmanager.getcursor(database)
    cats = categories.get_categories_active()
    date = f'{year}-{month}-01'
    for row in cats:
        catid = categories.get_category_id(row['category'])
        sql = (
            'INSERT INTO budgets (date, category_id, amount) VALUES '
            '((?), (?), 0) '
        )
        dbcursor.execute(sql, (date, str(catid)))
        database.commit()
