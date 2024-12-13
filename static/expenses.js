class Async{
    static getExpenses(begin, end, catid){
        const xhr = new XMLHttpRequest();
        if(catid == 0){
            xhr.open("GET", `/api/expenses/${begin}/${end}`);
        } else{
            xhr.open("GET", `/api/expenses/${begin}/${end}/${catid}`);
        }
        xhr.send();
        xhr.onload = (e) => {
            const exps = JSON.parse(xhr.response);
            UI.showExpenses(exps);
        };
    }

    static updateExpenses(expenses){
        const xhr = new XMLHttpRequest();
        xhr.open("POST", '/api/expenses/update');
        xhr.setRequestHeader('Content-Type', 'application/json')
        xhr.send(JSON.stringify(expenses));
        xhr.onload = (e) => {
            if(JSON.parse(xhr.response).processed == "true"){
                console.log("UPDATED");
            }
        };
    }

    static async fetchCategories(){
        let response = await fetch(`/api/categories`);
        let user = await response.json();
        sessionStorage.setItem("categories", JSON.stringify(user));
        return user;
    }
}

class UI{
    static fillOriginalSelect(categories){
        const select = document.querySelector(".select");
        for(let cat in categories){
            const opt = document.createElement("option");
            opt.value = categories[cat]['id'];
            opt.innerHTML = categories[cat]['category'];
            select.appendChild(opt);
        }
    }

    static showExpenses(exps){
        const expensesSection = document.getElementById("expenses");
        expensesSection.innerHTML = "";
        const table = document.createElement("table");
        const tbody = document.createElement("tbody");
        table.classList = "table";
        table.innerHTML = `
            <colgroup>
                <col span="1" style="width:20%;">
                <col span="1" style="width:40%;">
                <col span="1" style="width:25%;">
                <col span="1" style="width:15%;">
            </colgroup>
            <thead>
                <th>Date</th>
                <th>Item</th>
                <th>Category</th>
                <th class="right">Amount</th>
            </thead>
        `;
        table.appendChild(tbody);

        for(let i = 0; i < exps.length; i++){
            const te = UI.addTableExpense(exps[i]);
            tbody.appendChild(te);
        }
        expensesSection.appendChild(table);
    }

    static addTableExpense(exp){
        const categories = sortObjectByValue(JSON.parse(sessionStorage.getItem("categories")));
        const div = document.createElement("tr");
        div.id = exp["id"];
        div.innerHTML = `
            <td>
                <input type="date" class="input date input">
            </td>
            <td>
                <input type="text" class="input item">
            </td>
            <td>
                <select class="select input category input">
                </select>
            </td>
            <td>
                <input type="text" class="input item amount right">
            </td>
        `;

        const select = div.querySelector(".select");
        let val = 0;
        for(let cat in categories){
            if(categories[cat]['category'] === exp["category"]){
                val = categories[cat]['id'];
            }
            const opt = document.createElement("option");
            opt.value = categories[cat]['id'];
            opt.innerHTML = categories[cat]['category'];
            select.appendChild(opt);
        }
        select.value = val;

        const date = div.querySelector(".date");
        const item = div.querySelector(".item");
        const amount = div.querySelector(".amount");

        var d = new Date(exp["date"]);
        const newDate = document.createElement("input");
        newDate.type = "date";
        newDate.classList = "input date";
        newDate.value = d.toISOString().substring(0, 10);

        const newItem = document.createElement("input");
        newItem.type = "text";
        newItem.classList = "input item";
        newItem.value = exp["item"];

        const newAmount = document.createElement("input");
        newAmount.type = "text";
        newAmount.classList = "input item amount right";
        newAmount.value = cents_to_dollars(exp["amount"]);

        date.parentNode.replaceChild(newDate, date);
        item.parentNode.replaceChild(newItem, item);
        amount.parentNode.replaceChild(newAmount, amount);

        return div;
    }
}

function checkDate(date){
    return /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(date);
}

function checkItem(item){
    return /^.{1,255}$/.test(item);
}

function checkAmount(amount){
    return /^[\-0-9\.]+$/.test(amount)
}

function cents_to_dollars(cents){
    if(cents < 0){
        return `${(0 - (Math.abs(cents) / 100)).toFixed(2)}`;
    }
    return `${(Math.abs(cents) / 100).toFixed(2)}`;
}

function queryExpenses(){
    var fromDate = document.getElementById("from-date").value;
    var toDate = document.getElementById("to-date").value;
    var catID = document.getElementById("categoryid").value;

    if(!checkDate(fromDate)){
        fromDate = "2020-01-01";
    }
    if(!checkDate(toDate)){
        const today = new Date();
        toDate = today.toISOString().substring(0, 10); 
    }
    Async.getExpenses(fromDate, toDate, catID);
}

function updateExpenses(){
    newexpenses = [];
    var expenses = document.querySelector("tbody");
    for(var i = 0; i < expenses.children.length; i++){
        let exp = {};
        exp["id"] = expenses.children[i].id;
        exp["date"] = expenses.children[i].querySelector(".date").value;
        exp["item"] = expenses.children[i].querySelector(".item").value;
        exp["category"] = expenses.children[i].querySelector(".category").value;
        exp["amount"] = expenses.children[i].querySelector(".amount").value;
        if(checkDate(exp["date"]) && checkItem(exp["item"]) && checkAmount(exp["amount"])){
            newexpenses.push(exp);
        }
    }
    Async.updateExpenses(newexpenses);
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

function sortObjectByValue(obj){
    let sortobj = [];
    for(let item in obj){
        sortobj.push(obj[item]);
    }
    return sortobj.sort(function (a, b){
        return a['priority'] - b['priority'];
    });
}

async function loadCategories(){
    let categories;
    if(sessionStorage.getItem("categories") === null) {
        let response = await fetch(`/api/categories`);
        categories = await response.json();
        sessionStorage.setItem("categories", JSON.stringify(categories));
    } else{
        categories = JSON.parse(sessionStorage.getItem("categories"));
    }
    let sorted = sortObjectByValue(categories);
    UI.fillOriginalSelect(sorted);
    return categories;
}

/* Main Function */
loadCategories();

const queryButton = document.getElementById("query-expenses");
queryButton.addEventListener("click", queryExpenses);

const updateButton = document.getElementById("update-expenses");
updateButton.addEventListener("click", updateExpenses);

const menuButton = document.getElementById("menu-button");
menuButton.addEventListener("click", toggleMenu);
