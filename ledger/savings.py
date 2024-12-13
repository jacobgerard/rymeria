from . import expenses
from . import income
from .money import *


def get_savings(fromdate, todate):
    inc = value(income.get_income(fromdate, todate))
    exp = value(expenses.get_expenses_liabilities(fromdate, todate))
    return inc - exp


def get_savings_rate(fromdate, todate):
    inc = value(income.get_income(fromdate, todate))
    sav = get_savings(fromdate, todate)
    return float(sav / inc)
