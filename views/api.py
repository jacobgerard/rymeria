from flask import Blueprint, jsonify, request
from ledger import *
import json
import datetime as dt
import csv


api = Blueprint('api', __name__,
                template_folder='templates',
                url_prefix='/api')


@api.route("/")
def index():
    return 'INDEX'


@api.route("/budget/<period>/", methods=["GET"])
def bud_test(period=None):
    return jsonify(budget.get_budget(period))


@api.route("/budget/update/<period>/", methods=["POST"])
def bud_up(period = None):
    data = request.data
    pydata = json.loads(data)
    for budline in pydata:
        budget.update_budget(budline["id"], budline["amount"])
    results = {"processed": "true"}
    return jsonify(results)


@api.route("/budget/new/<period>/", methods=["POST"])
def bud_new(period = None):
    data = request.data
    pydata = json.loads(data)
    year = pydata[0:4]
    month = pydata[5:7]
    budget.generate_budget(year, month)
    results = {"processed": "true"}
    return jsonify(results)


@api.route("/expenses/", methods=["GET"])
def expenses_total():
    return jsonify(expenses.get_expenses("2020-01-01", "2099-12-31"))


@api.route("/expenses/<key>/", methods=["GET"])
def expenses_id(key):
    return jsonify(expenses.get_expense(key))


@api.route("/expenses/<begin>/<end>/", methods=["GET"])
def expenses_between(begin = None, end = None):
    return jsonify(expenses.get_expenses(begin, end))


@api.route("/expenses/<begin>/<end>/<categoryid>/", methods=["GET"])
def expenses_category(begin, end, categoryid):
    return jsonify(expenses.get_expenses_category(begin, end, categoryid))


@api.route("/expenses/<begin>/<end>/t<tagid>/", methods=["GET"])
def expenses_tag(begin, end, tagid):
    return jsonify(expenses.get_expenses_tag(begin, end, tagid))


@api.route("/expenses/<begin>/<end>/<categoryid>/t<tagid>/", methods=["GET"])
def expenses_category_tag(begin, end, categoryid, tagid):
    return jsonify(expenses.get_expenses_category_tag(begin, end, categoryid, tagid))


@api.route("/expenses/insert/", methods=["POST"])
def insert_expenses():
    data = json.loads(request.data)
    for exp in data:
        expenses.insert_expense(exp["date"], exp["item"], exp["category"], exp["amount"])
    print(data)
    return jsonify({"processed": "true"})


@api.route("/expenses/update/", methods=["POST"])
def update_expenses():
    data = json.loads(request.data)
    for exp in data:
        expenses.update_expense(exp["id"], exp["date"], exp["item"], exp["category"], exp["amount"])
    return jsonify({"processed": "true"})


@api.route("/expenses/csv/<begin>/<end>/", methods=["GET"])
def export_expenses_csv(begin = None, end = None):
    exps = expenses.export_expense_csv(begin, end)
    file = open("static/documents/expenses.csv", "w")
    writer = csv.DictWriter(file, ["date", "item", "category", "amount"])
    writer.writeheader()
    writer.writerows(exps)
    return jsonify({"processed":"true"})


@api.route("/expenses/insert/csv/", methods=["POST"])
def insert_expenses_csv():
    data = request.get_data()
    reader = csv.DictReader(data.decode().strip().splitlines())
    for row in reader:
        if row['amount'][0] == '$':
            row['amount'] = row['amount'][1:]
        tmp = row['date'].split('/')
        row['date'] = dt.date(int(tmp[2]), int(tmp[0].zfill(2)), int(tmp[1].zfill(2)))
        print(row)
        expenses.insert_expense_csv(row['date'], row['item'], row['category'], row['amount'])
    return jsonify({"processed": "true"})


@api.route("/goals/", methods=["GET"])
def get_goals():
    return jsonify(goals.get_goals())


@api.route("/goals/insert/", methods=["POST"])
def insert_goal():
    data = json.loads(request.data)
    for row in data:
        networth.update_goal(row)
    return jsonify({"processed": "true"})


@api.route("/income/", methods=["GET"])
def income_total():
    return jsonify(income.get_income("2020-01-01", "2099-12-31"))


@api.route("/income/<begin>/<end>/", methods=["GET"])
def income_between(begin = None, end = None):
    return jsonify(income.get_income(begin, end))


@api.route("/income/insert/", methods=["POST"])
def income_insert():
    data = request.data
    pydata = json.loads(data)
    for inc in pydata:
        income.insert_income(inc["date"], inc["item"], inc["amount"], inc["retirement"])
    results = {"processed": "true"}
    return jsonify(results)


@api.route("/networth/", methods=["GET"])
def networth_total():
    date = dt.date.today()
    period = str(date.year) + '-' + str(date.month).zfill(2)
    return jsonify(networth.get_networth(period))


@api.route("/networth/<period>/", methods=["GET"])
def networth_period(period = None):
    return jsonify(networth.get_networth(period))


@api.route("/networth/accounts/<period>/", methods=["GET"])
def networth_accounts(period = None):
    return jsonify(networth.get_networth_accounts(period))


@api.route("/networth/update/<period>/", methods=["POST"])
def net_up(period = None):
    data = request.data
    pydata = json.loads(data)
    for netline in pydata:
        networth.update_networth(netline["id"], netline["amount"])
    results = {"processed": "true"}
    return jsonify(results)


@api.route("/networth/new/<period>/", methods=["POST"])
def net_new(period = None):
    data = request.data
    pydata = json.loads(data)
    year = pydata[0:4]
    month = pydata[5:7]
    networth.generate_networth(year, month)
    results = {"processed": "true"}
    return jsonify(results)


@api.route("/networth/chart/<begin>/<end>/", methods=["GET"])
def net_chart(begin = None, end = None):
    return networth.generate_chart_svg(begin[0:7], end[0:7])


@api.route("/categories/", methods=["GET"])
def get_categories():
    return jsonify(categories.get_categories())


@api.route("/categories/insert/", methods=["POST"])
def insert_categories():
    data = json.loads(request.data)
    for cat in data:
        categories.insert_category(cat["category"], cat["type"], cat["priority"], cat["inactive"])
    return jsonify({"processed": "true"})


@api.route("/categories/update/", methods=["POST"])
def update_categories():
    data = json.loads(request.data)
    for cat in data:
        categories.update_category(cat["id"], cat["category"], cat["type"], cat["priority"], cat["inactive"])
    return jsonify({"processed": "true"})


@api.route("/accounts/", methods=["GET"])
def get_accounts():
    return jsonify(networth.get_accounts_all())


@api.route("/accounts/insert/", methods=["POST"])
def insert_accounts():
    data = json.loads(request.data)
    for acct in data:
        networth.insert_account(acct["account"], acct["type"], acct["priority"], acct["retirement"], acct["savings"], acct["inactive"])
    return jsonify({"processed": "true"})


@api.route("/accounts/update/", methods=["POST"])
def update_accounts():
    data = json.loads(request.data)
    for acct in data:
        networth.update_account(acct["id"], acct["account"], acct["type"], acct["priority"], acct["retirement"], acct["savings"], acct["inactive"])
    return jsonify({"processed": "true"})


@api.route("/tags/insert/", methods=["POST"])
def insert_tags():
    data = json.loads(request.data)
    for tag in data:
        tags.insert_tag(tag["tag"], tag["inactive"])
    return jsonify({"processed": "true"})


@api.route("/tags/update/", methods=["POST"])
def update_tags():
    data = json.loads(request.data)
    for t in data:
        tags.update_tag(t["id"], t["tag"], t["inactive"])
    return jsonify({"processed": "true"})


@api.route("/tagsactive/", methods=["GET"])
def get_tags_active():
    return jsonify(tags.get_tags_active())


@api.route("/expensetags/<expid>/", methods=["GET"])
def get_expensetags(expid = None):
    return jsonify(tags.get_expensetags(expid))


@api.route("/expensetags/update/", methods=["POST"])
def toggle_expensetags():
    data = json.loads(request.data)
    tags.toggle_expensetags(data['tag_id'], data['expense_id'])
    return jsonify({"processed": "true"})
