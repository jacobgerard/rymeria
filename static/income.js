class Async{
    static sendIncome(income){
        const xhr = new XMLHttpRequest();
        xhr.open("POST", '/api/income/insert');
        xhr.setRequestHeader('Content-Type', 'application/json')
        xhr.send(JSON.stringify(income));
        xhr.onload = (e) => {
            if(JSON.parse(xhr.response).processed == "true"){
                UI.clearIncome();
            }
        };
    }
}

class UI{
    static emptyIncome = `
        <div class="label">
            <label class="block">Date</label>
            <input type="date" class="input date"></input>
        </div>
        <div class="label">
            <label class="block">Item</label>
            <input type="text" class="input item"></input>
        </div>
        <div class="horizontal">
            <div class="even label">
                <label class="block">Amount</label>
                <input type="text" class="shrink-input block amount"></input>
            </div>
            <div class="even label center">
                <label class="block">Retirement</label>
                <input type="checkbox" class="retirement" name="retirement"></input>
            </div>
            <div class="even label">
                <label class="block">Delete</label>
                <button class="inline-button">X</button>
            </div>
        </div>
    `;

    static addEmptyIncome(){
        const list = document.getElementById("insert-income"); 
        const income = document.createElement("div");
        income.className = "box horv";
        income.innerHTML = UI.emptyIncome;
        list.appendChild(income);
    }

    static clearIncome(){
        const list = document.getElementById("insert-income"); 
        list.innerHTML = "";
        const income = document.createElement("div");
        income.className = "box horv";
        income.innerHTML = UI.emptyIncome;
        list.appendChild(income);
    }

    static deleteIncome(inc){
        inc.remove();
    }
}

function checkItem(item){
    return /^.{1,255}$/.test(item);
}

function checkAmount(amount){
    return /^[\-0-9\.]+$/.test(amount)
}

function checkDate(date){
    return /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(date);
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

function checkIncome(e){
    var fromDate = document.getElementById("from-date").value;
    var toDate = document.getElementById("to-date").value;

    if(!checkDate(fromDate)){
        fromDate = "2020-01-01";
    }
    if(!checkDate(toDate)){
        const today = new Date();
        toDate = today.toISOString().substring(0, 10); 
    }

    base = "/income/" + fromDate + "/" + toDate + "/";
    console.log(base);
    window.location.href = base;
}

function addEmptyIncome(){
    UI.addEmptyIncome();
}

function submitIncome(){
    income = [];
    const insert = document.getElementById("insert-income");
    for(let i = 0; i < insert.children.length; i++){
        let inc = {};
        inc["date"] = insert.children[i].querySelector(".date").value;
        inc["item"] = insert.children[i].querySelector(".item").value;
        inc["amount"] = insert.children[i].querySelector(".amount").value;
        inc["retirement"] = insert.children[i].querySelector(".retirement").checked;
        if(checkDate(inc["date"]) && checkItem(inc["item"]) && checkAmount(inc["amount"])){
            income.push(inc);
        }
    }
    console.log(income);
    Async.sendIncome(income);
}

function clearIncome(){
    UI.clearIncome();
}

function deleteIncome(e){
    if(e.target.innerHTML == "X"){
        UI.deleteIncome(e.target.parentNode.parentNode.parentNode);
    }
}

/* Main Function */
const addButton = document.getElementById("add-income");
addButton.addEventListener("click", addEmptyIncome);

const submitIncomeButton = document.getElementById("submit-income");
submitIncomeButton.addEventListener("click", submitIncome);

const clearButton = document.getElementById("clear-income");
clearButton.addEventListener("click", clearIncome);

const insertSection = document.getElementById("insert-income");
insertSection.addEventListener("click", deleteIncome);

const menuButton = document.getElementById("menu-button");
menuButton.addEventListener("click", toggleMenu);

const submitButton = document.getElementById("query-income");
submitButton.addEventListener("click", checkIncome);
