#!/usr/bin/env python3

import json
import os
import ledger


def main():
    with open("configuration.json") as file:
        configuration = json.load(file)

    os.system(f"sqlite3 {configuration["file-path"]} < model.sql")

    start_year = configuration["start-year"]
    ledger.dbmanager.config = configuration["file-path"]

    for index, asset_category in enumerate(configuration["categories"]["Assets"]):
        ledger.categories.insert_category(asset_category, "A", index, 0)

    for index, liability_category in enumerate(configuration["categories"]["Liabilities"]):
        ledger.categories.insert_category(liability_category, "L", index, 0)

    for index, asset_account in enumerate(configuration["accounts"]["Assets"]):
        ledger.networth.insert_account(asset_account, "A", index, 0, 0, 0)

    for index, liability_account in enumerate(configuration["accounts"]["Liabilities"]):
        ledger.networth.insert_account(liability_account, "L", index, 0, 0, 0)

    for index, goal in enumerate(configuration["savings"]):
        ledger.goals.new_goal(goal, index, f"{start_year}-01-01")


if __name__ == "__main__":
    main()
