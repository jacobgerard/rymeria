# Rymeria

This is a dockerized finance tracking website that I built to use on my home
network. It is a simple flask application with a basic API interacting with
business logic code inside the `ledger` package. The beauty is that this is a
simple configuration file to get set up and then almost all the information is
just stored in a sqlite database that is easy to keep backups of.

Most importantly, this app makes it so you need to manually enter your expenses
and get instant feedback on your current budget progress. There are many
websites and apps that do this for you and have more features. However, I
wanted to write something myself so that no outside entity besides banks have
my financial information. The simplicity has also helped my wife and I save a
ton more money each month since we always have to input the information
ourselves and see the information in a clean format. One downside is that this
is only hosted on my internal home network. Despite working in the security
field, I have not spent much time on making sure this is safe or compliant in
any way.
 
The UI and animations aren't anything special as I don't really do much web
development and just wanted to use this project to expose myself to everything
in vanilla form. I rolled my own HTML, CSS, and Javascript on the front end. I
minimally maintain this codebase if there are things that we decide might be
useful additions. And each time I open it up I'm shocked with how bad some of
the design decisions I made were. But it works for us in practice and that is
what matters in this case. 

There are probably quite a few bugs and/or unhandled error conditions since
this was written before I started writing out solid test cases. I will probably
get around to addressing those in the next year or so since I typically use the
same code to write up reports at the end of each year.

## Install

There are a few steps for installation roughly laid out below.

1. Clone and enter the git repo
2. Adjust the `configuration.json` file to the settings that are desired (you
   can edit Accounts and Categories in the webpage but you can't currently
   change the number of `savings` goals)
3. Setup a python virtual environment and install dependencies
4. Run the `initialize.py` script to build the beginning database
5. Build the docker image
6. Edit the `docker-compose.yml` file to expose your database file to a running
   container
7. Run `docker-compose`

Example commands for this process are shown below:

```sh
# Step 1
export RYMERIA=/home/user/rymeria
git clone https://github.com/jacobgerard/rymeria ${RYMERIA}
cd ${RYMERIA}

# Step 2
# edit configuration.json

# Step 3
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Step 4
python3 initialize.py

# Step 5
docker build -t rymeria:latest .

# Step 6
# edit docker-compose.yml to have database location from Step 2

# Step 7
docker-compose up -d
```

And to stop the container just enter the directory and run `docker-compose
down`.

## Usage

You can play around with most of the site and hopefully find that it is pretty
intuitive. Just be aware that for almost everything (besides tagging) you will
need to press `Submit` or `Update` to actually push changes to the database.
That is a product of me wanting less API calls to run in the background and not
really understanding much about Javascript at the time of development.

## Main Pages

- Index / Insert Expenses
- Expenses
- Budget
- Income
- Savings
- Net Worth
- Administration
- Accounts [hidden]
- Categories [hidden]
- Charting [hidden]
- Submit CSV [hidden]
- Retrieve CSV [hidden]

## TODO

- [ ] Add ways to add or hide savings goals besides initial configuration
- [ ] Add test cases to fix bugs in business logic
