import functools
import datetime as dt


# Returns string with 2 decimals for cents
def cents_to_dollars(cents):
    cents = int(cents)
    if cents < 0:
        return '{0}.{1:02d}'.format(0 - (abs(cents) // 100), abs(cents) % 100)
    return '{0}.{1:02d}'.format(cents // 100, cents % 100)


# Comma separated number string
def cents_to_comma_dollars(cents):
    cents = int(cents)
    if cents < 0:
        return '{0:,}.{1:02d}'.format(0 - (abs(cents) // 100), abs(cents) % 100)
    return '{0:,}.{1:02d}'.format(cents // 100, cents % 100)


# Returns an int of the total cents from a string decimal
def dollars_to_cents(dollars):
    if type(dollars) is not str or dollars == '.' or dollars == '':
        return 0
    negative = False
    if dollars[0] == '-':
        negative = True

    sides = dollars.split('.')
    if sides[0] == '':
        sides[0] = 0
    if len(sides) == 2:
        if len(sides[1]) == 2 and negative:
            return (int(sides[0]) * 100) - int(sides[1])
        if len(sides[1]) == 2:
            return (int(sides[0]) * 100) + int(sides[1])
        elif len(sides[1]) == 1 and negative:
            return (int(sides[0]) * 100) - (int(sides[1]) * 10)
        elif len(sides[1]) == 1:
            return (int(sides[0]) * 100) + (int(sides[1]) * 10)
        else:
            return (int(sides[0]) * 100)
    elif len(sides) == 1:
        return int(sides[0]) * 100
    else:
        return 0


def percentage(cents, percent):
    return round(cents * (percent / 100))


def pull_amount(row):
    return row['amount']


def value(arr):
    if len(arr) == 0:
        return 0
    return functools.reduce(lambda x, y: x+y, map(pull_amount, arr))


def months_until(duedate):
    date = dt.date.today()
    months = duedate.month - date.month
    months += (duedate.year - date.year) * 12
    return months


def to_period(date):
    return str(date)[:-3]


def get_growth(begin, end):
    return abs((end - begin) / begin)
