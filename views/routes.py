from flask import Flask, render_template, request, jsonify
from views.api import api
from ledger import *
import datetime
import json


app = Flask(__name__, template_folder="../templates", static_folder="../static")
app.register_blueprint(api)


@app.route("/")
def index_page():
    return render_template("home.html", script="script.js")


@app.route("/budget/", methods=["GET"])
def budget_page():
    with open("configuration.json") as file:
        configuration = json.load(file)
        start = configuration["start-year"]
        end = datetime.date.today().year + 1
        years = [year for year in range(start, end)]
        years.reverse()
    return render_template("budget.html", script="budget.js", years=years)


@app.route("/expenses/", methods=["GET"])
def expenses_page():
    return render_template("expensetags.html", script="expensetags.js")


@app.route("/networth/", methods=["GET"])
def networth_page():
    with open("configuration.json") as file:
        configuration = json.load(file)
        start = configuration["start-year"]
        end = datetime.date.today().year + 1
        years = [year for year in range(start, end)]
        years.reverse()
    return render_template("networth.html", script="networth.js", years=years)


@app.route("/savings/", methods=["GET"])
def savings_page():
    date = datetime.date.today()
    print(date)
    period = str(date.year) + '-' + str(date.month).zfill(2)
    fund = networth.get_savings(period)
    if not fund:
        date = previous_month(date)
        period = money.to_period(date)
        fund = networth.get_savings(period)
    if not fund:
        fund = 0
    fundstr = money.cents_to_dollars(fund)
    goallist = goals.get_goals_active()
    used = 0
    permonth = 0
    for row in goallist:
        used += row['amount']
        months = money.months_until(row['due_date'])
        if months > 0:
            permonth += (row['goal_amount'] - row['amount']) / months
        row['amount'] = money.cents_to_dollars(str(row['amount']))
        row['goal_amount'] = money.cents_to_dollars(str(row['goal_amount']))
    diffstr = money.cents_to_dollars(fund - used)
    return render_template("savings.html", script="savings.js", goallist=goallist, fund=fundstr, difference=diffstr, permonth=money.cents_to_dollars(int(permonth)))


@app.route("/savings/<begin>/<end>/", methods=["GET"])
def savings_result(begin = None, end = None):
    save = '$' + money.cents_to_dollars(str(savings.get_savings(begin, end)))
    return render_template("savingsresult.html", script="menu.js", savings=save)


@app.route("/income/", methods=["GET"])
def income_page():
    return render_template("income.html", script="income.js")


@app.route("/income/<begin>/<end>/", methods=["GET"])
def income_result(begin = None, end = None):
    inc = '$' + money.cents_to_dollars(str(money.value(income.get_income(begin, end))))
    takehome = '$' + money.cents_to_dollars(str(money.value(income.get_income_takehome(begin, end))))
    return render_template("incomeresult.html", script="menu.js", income=inc, takehome=takehome)


@app.route("/admin/")
def admin_page():
    return render_template("admin.html", script="admin.js")


@app.route("/categories/", methods=["GET"])
def categories_page():
    cats = categories.get_categories_all()
    return render_template("categories.html", script="categories.js", categories=cats)


@app.route("/accounts/", methods=["GET"])
def accounts_page():
    accts = networth.get_accounts_all()
    return render_template("accounts.html", script="accounts.js", accounts=accts)


@app.route("/charting/", methods=["GET"])
def charting_page():
    return render_template("charting.html", script="charting.js")


@app.route("/submitcsv/", methods=["GET"])
def submitcsv_page():
    return render_template("submitcsv.html", script="submitcsv.js")


@app.route("/retrievecsv/", methods=["GET"])
def retrievecsv_page():
    return render_template("retrievecsv.html", script="retrievecsv.js")


@app.route("/tags/", methods=["GET"])
def tags_page():
    t = tags.get_tags()
    return render_template("tags.html", script="tags.js", tags=t)
