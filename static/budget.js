async function fetchBudget(period){
    let response = await fetch(`/api/budget/${period}`);
    let user = await response.json();
    return user;
}

async function fetchExpenses(period){
    let response = await fetch(`/api/expenses/${period + '-01'}/${period + '-31'}`);
    let user = await response.json();
    return user;
}

class Async{
    static updateBudget(period, budget){
        const xhr = new XMLHttpRequest();
        xhr.open("POST", `/api/budget/update/${period}`);
        xhr.setRequestHeader('Content-Type', 'application/json')
        xhr.send(JSON.stringify(budget));
        xhr.onload = (e) => {
            if(JSON.parse(xhr.response).processed == "true"){
                console.log("UPDATED BUDGET DB");
            }
        };
    }

    static newBudget(period){
        return new Promise(function (resolve, reject){
            const xhr = new XMLHttpRequest();
            xhr.open("POST", `/api/budget/new/${period}`);
            xhr.setRequestHeader('Content-Type', 'application/json')
            xhr.send(JSON.stringify(period));
            xhr.onload = (e) => {
                if(JSON.parse(xhr.response).processed == "true"){
                    console.log("UPDATED BUDGET DB");
                    resolve();
                }else{
                    reject();
                }
            };
        });
    }
}

class UI{
    static showNewButton(){
        const newButton = document.getElementById("newbudget");
        newButton.classList.remove("hidden");
    }

    static hideNewButton(){
        const newButton = document.getElementById("newbudget");
        newButton.classList.add("hidden");
    }

    static showUpdateButton(){
        const updateButton = document.getElementById("update");
        updateButton.classList.remove("hidden");
    }

    static hideUpdateButton(){
        const updateButton = document.getElementById("update");
        updateButton.classList.add("hidden");
    }

    static showBudget(budget, spent, delta, totals){
        UI.clearBudget();

        const budgetSection = document.getElementById("budget");
        budgetSection.innerHTML = `
            <table class="small-table w100">
                <thead>
                    <td class="bold w33">Category</td>
                    <td class="bold align-right w22">Budget</td>
                    <td class="bold align-right w22">Spent</td>
                    <td class="bold align-right w22">Delta</td>
                </thead>
                <tbody id="budgetlines">
                </tbody>
            </table>
        `;

        const linesSection = document.getElementById("budgetlines");
        let budline;
        for(let i = 0; i < budget.length; i++){
            budline = budget[i].category;
            const newLine = document.createElement("tr");
            newLine.id = budget[i].id;
            newLine.innerHTML = `
                <td class="w33">${budget[i].category}</td>
                <td class="align-right w22"><input type="text" class="shrinker-input align-right amount" value="${cents_to_dollars(budget[i].amount)}"></input></td>
                <td class="align-right w22">${cents_to_dollars(spent[budline])}</td>
                <td class="align-right w22">${cents_to_dollars(delta[budline])}</td>
            `;
            linesSection.appendChild(newLine);
        }
        const totalLine = document.createElement("tr");
        totalLine.classList = "top-border";
        totalLine.innerHTML = `
            <td class="bold w33">Totals</td>
            <td class="bold align-right w22">${cents_to_dollars(totals.budget)}</td>
            <td class="bold align-right w22">${cents_to_dollars(totals.spent)}</td>
            <td class="bold align-right w22">${cents_to_dollars(totals.delta)}</td>
        `;
        linesSection.appendChild(totalLine);

        var test = cents_to_dollars(totals.spent);
        console.log(test);
    }

    static clearBudget(){
        const budgetSection = document.getElementById("budget");
        budgetSection.innerHTML = '';
    }
}

function toggleMenu(){
    const pageMenu = document.getElementById("page-choice");
    if(pageMenu.classList.contains("close")){
        pageMenu.classList.remove("close");
        pageMenu.classList.add("open");
    } else{
        pageMenu.classList.remove("open");
        pageMenu.classList.add("close");
    }
}

function simpleSum(x, y){
    return x + y;
}

function budgetSum(x, y){
    return x + y.amount;
}

function addExpenses(budget, expenses){
    let spent = {};
    for(let i = 0; i < budget.length; i++){
        spent[budget[i].category] = 0;
    }
    for(let i = 0; i < expenses.length; i++){
        spent[expenses[i].category] += expenses[i].amount;
    }
    return spent;
}

function calculateTotals(budget, spent, delta){
    let totals = {};
    totals['budget'] = budget.reduce(budgetSum, 0);
    //console.log(spent);
    totals['spent'] = Object.values(spent).reduce(simpleSum);
    totals['delta'] = Object.values(delta).reduce(simpleSum);
    return totals;
}

function calculateDelta(budget, spent){
    let delta = {};
    for(let i = 0; i < budget.length; i++){
        delta[budget[i].category] = budget[i].amount - spent[budget[i].category];
    }
    return delta;
}

function cents_to_dollars(cents){
    if(cents < 0){
        return `${(0 - (Math.abs(cents) / 100)).toFixed(2)}`;
    }
    return `${(Math.abs(cents) / 100).toFixed(2)}`;
}

function checkAmount(amount){
    return /^[0-9\.]+$/.test(amount)
}

async function checkBudget(){
    let year = document.getElementById("year").value;
    let month = document.getElementById("month").value;
    let period = `${year}-${month}`;
    let budget = await fetchBudget(period);
    let expenses = await fetchExpenses(period);
    if(budget.length == 0){
        UI.hideUpdateButton();
        UI.showNewButton();
        UI.clearBudget();
        return 0;
    }
    let spent = addExpenses(budget, expenses);
    let delta = calculateDelta(budget, spent);
    let totals = calculateTotals(budget, spent, delta);
    UI.showBudget(budget, spent, delta, totals);
    UI.showUpdateButton();
    UI.hideNewButton();
    return 0;
}

function updateBudget(){
    let year = document.getElementById("year").value;
    let month = document.getElementById("month").value;
    let period = `${year}-${month}`;
    let newbudget = [];
    const budgetlines = document.querySelector("tbody");
    for(let i = 0; i < budgetlines.children.length - 1; i++){
        let bud = {};
        bud["id"] = budgetlines.children[i].id;
        bud["amount"] = budgetlines.children[i].querySelector(".amount").value;
        if(checkAmount(bud["amount"])){
            newbudget.push(bud);
        }
    }
    Async.updateBudget(period, newbudget);
}

async function newBudget(){
    let year = document.getElementById("year").value;
    let month = document.getElementById("month").value;
    let period = `${year}-${month}`;
    await Async.newBudget(period);
    checkBudget();
}

/* Main Function */
const menuButton = document.getElementById("menu-button");
menuButton.addEventListener("click", toggleMenu);

const submitButton = document.getElementById("query-budget");
submitButton.addEventListener("click", checkBudget);

const updateButton = document.getElementById("update-budget");
updateButton.addEventListener("click", updateBudget);

const newButton = document.getElementById("new-budget");
newButton.addEventListener("click", newBudget);
