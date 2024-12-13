from . import categories
from . import dbmanager
from .money import *


def get_expense(key):
    sql = (
        'SELECT expenses.id, expenses.date, expenses.item, '
        'categories.category, expenses.amount '
        'FROM expenses '
        'INNER JOIN categories '
        'ON expenses.category_id = categories.id '
        'WHERE expenses.id = (?) '
    )
    database = dbmanager.getdb()
    dbcursor = dbmanager.getcursor(database)
    dbcursor.execute(sql, (key, ))
    return [dict(row) for row in dbcursor.fetchall()]


def get_expenses(fromdate, todate):
    sql = (
        'SELECT expenses.id, expenses.date, expenses.item, '
        'categories.category, expenses.amount '
        'FROM expenses '
        'INNER JOIN categories '
        'ON expenses.category_id = categories.id '
        'WHERE expenses.date BETWEEN '
        '(?) AND (?) '
        'ORDER BY expenses.date '
    )
    database = dbmanager.getdb()
    dbcursor = dbmanager.getcursor(database)
    dbcursor.execute(sql, (fromdate, todate))
    return [dict(row) for row in dbcursor.fetchall()]


def get_expenses_assets(fromdate, todate):
    sql = (
        'SELECT expenses.id, expenses.date, expenses.item, '
        'categories.category, expenses.amount '
        'FROM expenses '
        'INNER JOIN categories '
        'ON expenses.category_id = categories.id '
        'WHERE expenses.date BETWEEN '
        '(?) AND (?) '
        'AND categories.type = "A" '
        'ORDER BY expenses.date '
    )
    database = dbmanager.getdb()
    dbcursor = dbmanager.getcursor(database)
    dbcursor.execute(sql, (fromdate, todate))
    return [dict(row) for row in dbcursor.fetchall()]


def get_expenses_liabilities(fromdate, todate):
    sql = (
        'SELECT expenses.date, expenses.item, '
        'categories.category, expenses.amount '
        'FROM expenses '
        'INNER JOIN categories '
        'ON expenses.category_id = categories.id '
        'WHERE expenses.date BETWEEN '
        '(?) AND (?) '
        'AND categories.type = "L" '
        'ORDER BY expenses.date '
    )
    database = dbmanager.getdb()
    dbcursor = dbmanager.getcursor(database)
    dbcursor.execute(sql, (fromdate, todate))
    return [dict(row) for row in dbcursor.fetchall()]


def get_expenses_category(fromdate, todate, categoryid):
    sql = (
        'SELECT expenses.id, expenses.date, expenses.item, '
        'categories.category, expenses.amount '
        'FROM expenses '
        'INNER JOIN categories '
        'ON expenses.category_id = categories.id '
        'WHERE expenses.date BETWEEN '
        '(?) AND (?) '
        'AND categories.id = (?) '
        'ORDER BY expenses.date '
    )
    database = dbmanager.getdb()
    dbcursor = dbmanager.getcursor(database)
    dbcursor.execute(sql, (fromdate, todate, categoryid))
    return [dict(row) for row in dbcursor.fetchall()]


def get_expenses_tag(fromdate, todate, tagid):
    sql = (
        'SELECT expenses.id, expenses.date, expenses.item, '
        'categories.category, expenses.amount '
        'FROM expenses '
        'INNER JOIN categories '
        'ON expenses.category_id = categories.id '
        'INNER JOIN expense_tags '
        'ON expenses.id = expense_tags.expense_id '
        'WHERE expenses.date BETWEEN '
        '(?) AND (?) '
        'AND expense_tags.tag_id = (?) '
        'ORDER BY expenses.date '
    )
    database = dbmanager.getdb()
    dbcursor = dbmanager.getcursor(database)
    dbcursor.execute(sql, (fromdate, todate, tagid))
    return [dict(row) for row in dbcursor.fetchall()]


def get_expenses_category_tag(fromdate, todate, categoryid, tagid):
    sql = (
        'SELECT expenses.id, expenses.date, expenses.item, '
        'categories.category, expenses.amount '
        'FROM expenses '
        'INNER JOIN categories '
        'ON expenses.category_id = categories.id '
        'INNER JOIN expense_tags '
        'ON expenses.id = expense_tags.expense_id '
        'WHERE expenses.date BETWEEN '
        '(?) AND (?) '
        'AND categories.id = (?) '
        'AND expense_tags.tag_id = (?) '
        'ORDER BY expenses.date '
    )
    database = dbmanager.getdb()
    dbcursor = dbmanager.getcursor(database)
    dbcursor.execute(sql, (fromdate, todate, categoryid, tagid))
    return [dict(row) for row in dbcursor.fetchall()]


def get_expenses_item(fromdate, todate, item):
    sql = (
        'SELECT expenses.id, expenses.date, expenses.item, '
        'categories.category, expenses.amount '
        'FROM expenses '
        'INNER JOIN categories '
        'ON expenses.category_id = categories.id '
        'WHERE expenses.date BETWEEN '
        '(?) AND (?) '
        'AND expenses.item = (?) '
        'ORDER BY expenses.date '
    )
    database = dbmanager.getdb()
    dbcursor = dbmanager.getcursor(database)
    dbcursor.execute(sql, (fromdate, todate, item))
    return [dict(row) for row in dbcursor.fetchall()]


def insert_expense(date, item, category, amount):
    sql = (
        'INSERT INTO expenses '
        '(date, item, category_id, amount) '
        'VALUES ((?), (?), (?), (?))'
    )
    amt = dollars_to_cents(amount)
    database = dbmanager.getdb()
    dbcursor = dbmanager.getcursor(database)
    dbcursor.execute(sql, (date, item, category, amt))
    database.commit()


def update_expense(expid, date, item, category, amount):
    sql = (
        'UPDATE expenses SET '
        'date = (?), '
        'item = (?), '
        'category_id = (?), '
        'amount = (?) '
        'WHERE id = (?) '
    )
    amt = dollars_to_cents(amount)
    database = dbmanager.getdb()
    dbcursor = dbmanager.getcursor(database)
    dbcursor.execute(sql, (date, item, category, amt, expid))
    database.commit()


def insert_expense_csv(date, item, category, amount):
    sql = (
        'INSERT INTO expenses '
        '(date, item, category_id, amount) '
        'VALUES ((?), (?), (?), (?))'
    )
    amt = dollars_to_cents(amount)
    catid = categories.get_category_id(category)
    database = dbmanager.getdb()
    dbcursor = dbmanager.getcursor(database)
    dbcursor.execute(sql, (date, item, catid, amt))
    database.commit()


def export_expense_csv(fromdate, todate):
    sql = (
        'SELECT expenses.date, expenses.item, '
        'categories.category, expenses.amount '
        'FROM expenses '
        'INNER JOIN categories '
        'ON expenses.category_id = categories.id '
        'WHERE expenses.date BETWEEN '
        '(?) AND (?) '
        'ORDER BY expenses.date '
    )
    database = dbmanager.getdb()
    dbcursor = dbmanager.getcursor(database)
    dbcursor.execute(sql, (fromdate, todate))
    exps = [dict(row) for row in dbcursor.fetchall()]
    explist = []
    newexp = {}
    for row in exps:
        newexp = row
        newexp['date'] = f"{row['date'].month}/{row['date'].day}/{row['date'].year}"
        print(newexp['date'])
        newexp['amount'] = cents_to_dollars(row['amount'])
        explist.append(newexp)
    return explist
