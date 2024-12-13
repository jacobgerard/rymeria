from . import dbmanager
from .money import *


def get_income(fromdate, todate):
    sql = (
        'SELECT date, item, amount '
        'FROM income '
        'WHERE date BETWEEN '
        '(?) AND (?) '
        'ORDER BY date '
    )
    database = dbmanager.getdb()
    dbcursor = dbmanager.getcursor(database)
    dbcursor.execute(sql, (fromdate, todate))
    return [dict(row) for row in dbcursor.fetchall()]


def get_income_takehome(fromdate, todate):
    sql = (
        'SELECT date, item, amount '
        'FROM income '
        'WHERE date BETWEEN '
        '(?) AND (?) '
        'AND retirement = 0 '
        'ORDER BY date '
    )
    database = dbmanager.getdb()
    dbcursor = dbmanager.getcursor(database)
    dbcursor.execute(sql, (fromdate, todate))
    return [dict(row) for row in dbcursor.fetchall()]


def get_income_retirement(fromdate, todate):
    sql = (
        'SELECT date, item, amount '
        'FROM income '
        'WHERE date BETWEEN '
        '(?) AND (?) '
        'AND retirement = 1 '
        'ORDER BY date '
    )
    database = dbmanager.getdb()
    dbcursor = dbmanager.getcursor(database)
    dbcursor.execute(sql, (fromdate, todate))
    return [dict(row) for row in dbcursor.fetchall()]


def insert_income(date, item, amount, retirement):
    sql = (
        'INSERT INTO income '
        '(date, item, amount, retirement) '
        'VALUES ((?), (?), (?), (?))'
    )
    amt = dollars_to_cents(amount)
    ret = 0
    if retirement:
        ret = 1
    database = dbmanager.getdb()
    dbcursor = dbmanager.getcursor(database)
    dbcursor.execute(sql, (date, item, amt, ret))
    database.commit()
