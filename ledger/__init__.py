from . import dbmanager
from . import money
from . import categories
from . import expenses
from . import income
from . import savings
from . import networth
from . import budget
from . import goals
from . import tags

import datetime as dt


def previous_month(date):
    if date.month == 1:
        return dt.date(date.year - 1, 12, date.day)
    return dt.date(date.year, date.month - 1, date.day)
