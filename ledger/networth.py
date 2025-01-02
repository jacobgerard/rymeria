from . import dbmanager
from .money import *

import datetime as dt
import numpy as np
import matplotlib as mpl
import matplotlib.pyplot as plt
import matplotlib.ticker as ticker
import matplotlib.dates as mdate


def get_account(period, account):
    sql = (
        'SELECT amount FROM networth '
        'INNER JOIN accounts '
        'ON networth.account = accounts.id '
        'WHERE strftime("%Y-%m", networth.date) = (?) '
        'AND accounts.account = (?);'
    )
    database = dbmanager.getdb()
    dbcursor = dbmanager.getcursor(database)
    dbcursor.execute(sql, (period, account))
    return dbcursor.fetchall()[0][0]


def get_savings(period):
    sql = (
        'SELECT SUM(amount) FROM networth '
        'INNER JOIN accounts '
        'ON networth.account = accounts.id '
        'WHERE strftime("%Y-%m", networth.date) = (?) '
        'AND accounts.savings = 1;'
    )
    database = dbmanager.getdb()
    dbcursor = dbmanager.getcursor(database)
    dbcursor.execute(sql, (period,))
    return dbcursor.fetchall()[0][0]


def get_retirement(period):
    sql = (
        'SELECT SUM(amount) FROM networth '
        'INNER JOIN accounts '
        'ON networth.account = accounts.id '
        'WHERE strftime("%Y-%m", networth.date) = (?) '
        'AND accounts.retirement = 1;'
    )
    database = dbmanager.getdb()
    dbcursor = dbmanager.getcursor(database)
    dbcursor.execute(sql, (period,))
    return dbcursor.fetchall()[0][0]


def get_assets(period):
    sql = (
        'SELECT SUM(amount) FROM networth '
        'INNER JOIN accounts '
        'ON networth.account = accounts.id '
        'WHERE strftime("%Y-%m", date) = (?) '
        'AND accounts.type = "A";'
    )
    database = dbmanager.getdb()
    dbcursor = dbmanager.getcursor(database)
    dbcursor.execute(sql, (period,))
    return dbcursor.fetchall()[0][0]


def get_liabilities(period):
    sql = (
        'SELECT SUM(amount) FROM networth '
        'INNER JOIN accounts '
        'ON networth.account = accounts.id '
        'WHERE strftime("%Y-%m", date) = (?) '
        'AND accounts.type = "L";'
    )
    database = dbmanager.getdb()
    dbcursor = dbmanager.getcursor(database)
    dbcursor.execute(sql, (period,))
    return dbcursor.fetchall()[0][0]


def get_networth(period):
    return get_assets(period) - get_liabilities(period)


def get_networth_accounts(period):
    sql = (
        'SELECT networth.id, accounts.account, accounts.type, networth.amount '
        'FROM networth '
        'INNER JOIN accounts '
        'ON networth.account = accounts.id '
        'WHERE strftime("%Y-%m", networth.date) = (?) '
        'ORDER BY accounts.priority '
    )
    database = dbmanager.getdb()
    dbcursor = dbmanager.getcursor(database)
    dbcursor.execute(sql, (period, ))
    return [dict(row) for row in dbcursor.fetchall()]


def update_goal(goal):
    amt = dollars_to_cents(goal['amount'])
    goal_amt = dollars_to_cents(goal['goal-amount'])
    print(goal['goal-date'])
    sql = (
        'UPDATE goals SET goal = (?), '
        'amount = (?), goal_amount = (?), '
        'due_date = (?) WHERE id = (?);'
    )
    database = dbmanager.getdb()
    dbcursor = dbmanager.getcursor(database)
    dbcursor.execute(sql, (goal['goal'], amt, goal_amt, goal['goal-date'], int(goal['id'])))
    database.commit()


def nextmonth(date):
    if date.month == 12:
        return dt.date(date.year + 1, 1, date.day)
    return dt.date(date.year, date.month + 1, date.day)


def tok(val, pos):
    if val == 0:
        return '0'
    return f'{int(val/1000)}K'


def mindate():
    sql = (
        'select date from networth ORDER BY date ASC LIMIT 1'
    )
    database = dbmanager.getdb()
    dbcursor = dbmanager.getcursor(database)
    dbcursor.execute(sql)
    return dbcursor.fetchall()[0][0]


def maxdate():
    sql = (
        'select date from networth ORDER BY date DESC LIMIT 1'
    )
    database = dbmanager.getdb()
    dbcursor = dbmanager.getcursor(database)
    dbcursor.execute(sql)
    return dbcursor.fetchall()[0][0]


def generate_chart(begdate, enddate):
    begdateform = dt.date(int(begdate[0:4]), int(begdate[5:]), 1)
    enddateform = dt.date(int(enddate[0:4]), int(enddate[5:]), 1)

    date = []
    amt = []
    beg = begdateform
    while beg <= enddateform:
        date.append(beg)
        amt.append(get_networth(str(beg.year) + '-' + str(beg.month).zfill(2))/100)
        beg = nextmonth(beg)

    amt = np.asarray(amt)
    fig, ax = plt.subplots()
    ax.grid(True)
    ax.plot(date, amt, color='#354259', linestyle="solid")
    ax.axhline(color='#354259', linewidth=1)
    ax.xaxis.set_minor_locator(mdate.YearLocator(1, month=7, day=1))
    ax.xaxis.set_major_locator(mdate.YearLocator(1, month=1, day=1))
    ax.yaxis.set_major_formatter(tok)
    ax.set_facecolor('#ece5c7')
    ax.spines['bottom'].set_color('#354259')
    ax.spines['left'].set_color('#354259')
    ax.tick_params(axis='x', colors='#354259')
    ax.tick_params(axis='y', colors='#354259')
    ax.set_axisbelow(True)
    ax.spines.right.set_visible(False)
    ax.spines.top.set_visible(False)
    ax.fill_between(date, amt, 0, interpolate = True, where = (amt > 0), color="#ded7bb", alpha=.75)
    ax.fill_between(date, amt, 0, interpolate = True, where = (amt <= 0), color="#f75757", alpha=.5)
    fig.patch.set_facecolor('#ece5c7')
    plt.margins(x=0)
    plt.tight_layout()
    plt.savefig('plot.svg')


def generate_chart_svg(begdate, enddate):
    begdateform = dt.date(int(begdate[0:4]), int(begdate[5:]), 1)
    enddateform = dt.date(int(enddate[0:4]), int(enddate[5:]), 1)

    date = []
    amt = []
    beg = begdateform
    while beg <= enddateform:
        date.append(beg)
        amt.append(get_networth(str(beg.year) + '-' + str(beg.month).zfill(2))/100)
        beg = nextmonth(beg)

    amt = np.asarray(amt)
    fig, ax = plt.subplots()
    ax.grid(True)
    ax.plot(date, amt, color='#354259', linestyle="solid")
    ax.axhline(color='#354259', linewidth=1)
    ax.xaxis.set_minor_locator(mdate.YearLocator(1, month=7, day=1))
    ax.xaxis.set_major_locator(mdate.YearLocator(1, month=1, day=1))
    ax.yaxis.set_major_formatter(tok)
    ax.set_facecolor('#ece5c7')
    ax.spines['bottom'].set_color('#354259')
    ax.spines['left'].set_color('#354259')
    ax.tick_params(axis='x', colors='#354259')
    ax.tick_params(axis='y', colors='#354259')
    ax.set_axisbelow(True)
    ax.spines.right.set_visible(False)
    ax.spines.top.set_visible(False)
    ax.fill_between(date, amt, 0, interpolate = True, where = (amt > 0), color="#ded7bb", alpha=.75)
    ax.fill_between(date, amt, 0, interpolate = True, where = (amt <= 0), color="#f75757", alpha=.5)
    fig.patch.set_facecolor('#ece5c7')
    plt.margins(x=0)
    plt.tight_layout()
    plt.savefig('plot.svg')
    out = ''
    with open('plot.svg', 'r') as f:
        out = f.read()
    return out


def generate_full_chart(markdate):
    dateform = dt.date(int(markdate[0:4]), int(markdate[5:]), 1)
    today = dt.date.today()
    today = maxdate()
    date = []
    amt = []
    beg = dt.date(2020, 1, 1)
    while beg <= today:
        date.append(beg)
        amt.append(get_networth(str(beg.year) + '-' + str(beg.month).zfill(2))/100)
        beg = nextmonth(beg)
    amt = np.asarray(amt)
    fig, ax = plt.subplots()
    ax.grid(True)
    ax.plot(date, amt, color='#354259', linestyle="solid")
    ax.axvline(dateform, linewidth=1)
    ax.axhline(color='#354259', linewidth=1)
    ax.xaxis.set_minor_locator(mdate.YearLocator(1, month=7, day=1))
    ax.xaxis.set_major_locator(mdate.YearLocator(1, month=1, day=1))
    ax.yaxis.set_major_formatter(tok)
    ax.set_facecolor('#ece5c7')
    ax.spines['bottom'].set_color('#354259')
    ax.spines['left'].set_color('#354259')
    ax.tick_params(axis='x', colors='#354259')
    ax.tick_params(axis='y', colors='#354259')
    ax.set_axisbelow(True)
    ax.spines.right.set_visible(False)
    ax.spines.top.set_visible(False)
    ax.fill_between(date, amt, 0, interpolate = True, where = (amt > 0), color="#ded7bb", alpha=.75)
    ax.fill_between(date, amt, 0, interpolate = True, where = (amt <= 0), color="#f75757", alpha=.5)
    fig.patch.set_facecolor('#ece5c7')
    plt.margins(x=0)
    plt.tight_layout()
    plt.savefig('static/plot.svg')


def get_accounts_all():
    sql = (
        'SELECT * FROM accounts '
        'ORDER BY priority '
    )
    database = dbmanager.getdb()
    dbcursor = dbmanager.getcursor(database)
    dbcursor.execute(sql)
    return [dict(row) for row in dbcursor.fetchall()]


def get_accounts_active():
    sql = (
        'SELECT * FROM accounts '
        'WHERE inactive = 0 '
        'ORDER BY priority '
    )
    database = dbmanager.getdb()
    dbcursor = dbmanager.getcursor(database)
    dbcursor.execute(sql)
    return [dict(row) for row in dbcursor.fetchall()]


def insert_account(acct, aorl, priority, retirement, savings, inactive):
    sql = (
        'INSERT INTO accounts '
        '(account, type, priority, retirement, savings, inactive) '
        'VALUES ((?), (?), (?), (?), (?), (?))'
    )
    ret = 0
    sav = 0
    ina = 0
    if retirement:
        ret = 1
    if savings:
        sav = 1
    if inactive:
        ina = 1
    database = dbmanager.getdb()
    dbcursor = dbmanager.getcursor(database)
    dbcursor.execute(sql, (acct, aorl, priority, ret, sav, ina))
    database.commit()


def update_account(acctid, acct, aorl, priority, retirement, savings, inactive):
    sql = (
        'UPDATE accounts SET '
        'account = (?), '
        'type = (?), '
        'priority = (?), '
        'retirement = (?), '
        'savings = (?), '
        'inactive = (?) '
        'WHERE id = (?) '
    )
    ret = 0
    sav = 0
    ina = 0
    if retirement:
        ret = 1
    if savings:
        sav = 1
    if inactive:
        ina = 1
    database = dbmanager.getdb()
    dbcursor = dbmanager.getcursor(database)
    dbcursor.execute(sql, (acct, aorl, priority, ret, sav, ina, acctid))
    database.commit()


def generate_networth(year, month):
    database = dbmanager.getdb()
    dbcursor = dbmanager.getcursor(database)
    accts = get_accounts_active()
    date = str(year) + '-' + str(month) + '-' + '01'
    print(date)
    for row in accts:
        sql = (
            'INSERT INTO networth (date, account, amount) VALUES '
            '((?), (?), 0) '
        )
        print(row)
        print(row['id'])
        dbcursor.execute(sql, (date, row['id']))
        database.commit()


def update_networth(sqlid, amount):
    sql = (
        'UPDATE networth SET '
        'amount = (?) '
        'WHERE id = (?) '
    )
    amt = dollars_to_cents(amount)
    database = dbmanager.getdb()
    dbcursor = dbmanager.getcursor(database)
    dbcursor.execute(sql, (amt, sqlid))
    database.commit()


# returns growth of year ending on date
def year_growth(date):
    begin = get_networth(to_period(dt.date(date.year - 1, date.month, date.day)))
    end = get_networth(to_period(date))
    return get_growth(begin, end)
