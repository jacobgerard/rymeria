class Async{
    static sendAccounts(accounts){
        const xhr = new XMLHttpRequest();
        xhr.open("POST", '/api/accounts/insert');
        xhr.setRequestHeader('Content-Type', 'application/json')
        xhr.send(JSON.stringify(accounts));
        xhr.onload = (e) => {
            if(JSON.parse(xhr.response).processed == "true"){
                UI.clearAccounts();        
            }
        };
    }

    static updateAccounts(accounts){
        const xhr = new XMLHttpRequest();
        xhr.open("POST", '/api/accounts/update');
        xhr.setRequestHeader('Content-Type', 'application/json')
        xhr.send(JSON.stringify(accounts));
        xhr.onload = (e) => {
            if(JSON.parse(xhr.response).processed == "true"){
                console.log("UPDATED");
            }
        };
    }
}

class UI{
    static emptyAccount = `
        <div class="label">
            <label class="block">Account</label>
            <input type="text" class="input account"></input>
            <label class="block">Type</label>
            <input type="text" class="input type"></input>
            <label class="block">Priority</label>
            <input type="text" class="input priority"></input>
            <div class="horizontal">
                <div class="even label">
                    <label class="block">Retirement</label>
                    <input type="checkbox" class="retirement" name="retirement"></input>
                </div>
                <div class="even label">
                    <label class="block">Savings</label>
                    <input type="checkbox" class="savings" name="savings"></input>
                </div>
                <div class="even label">
                    <label class="block">Inactive</label>
                    <input type="checkbox" class="inactive" name="inactive"></input>
                </div>
                <div class="even label">
                    <label class="block">Delete</label>
                    <button class="inline-button">X</button>
                </div>
            </div>
        </div>
    `;

    static addEmptyAccount(){
        const list = document.getElementById("insert-accounts"); 
        const account = document.createElement("div");
        account.className = "box horv";
        account.innerHTML = UI.emptyAccount;
        list.appendChild(account);
    }

    static clearAccounts(){
        const list = document.getElementById("insert-accounts"); 
        list.innerHTML = "";
        const account = document.createElement("div");
        account.className = "box horv";
        account.innerHTML = UI.emptyAccount;
        list.appendChild(account);
    }

    static deleteAccount(acct){
        acct.remove();
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

function addAccount(){
    UI.addEmptyAccount();
}

function checkItem(item){
    return /^.{1,255}$/.test(item);
}

function checkType(type){
    return /^[AL]$/.test(type);
}

function checkPriority(pri){
    return /^[0-9]+$/.test(pri);
}

function submitAccounts(){
    accounts = [];
    const insert = document.getElementById("insert-accounts");
    for(let i = 0; i < insert.children.length; i++){
        let acct = {};
        acct["account"] = insert.children[i].querySelector(".account").value;
        acct["type"] = insert.children[i].querySelector(".type").value;
        acct["priority"] = insert.children[i].querySelector(".priority").value;
        acct["retirement"] = insert.children[i].querySelector(".retirement").checked;
        acct["savings"] = insert.children[i].querySelector(".savings").checked;
        acct["inactive"] = insert.children[i].querySelector(".inactive").checked;
        if(checkItem(acct["account"]) && checkType(acct["type"]) && checkPriority(acct["priority"])){
            accounts.push(acct);
        }
    }
    console.log(accounts);
    Async.sendAccounts(accounts);
}

function clearAccounts(){
    UI.clearAccounts(); 
}

function deleteAccount(e){
    if(e.target.innerHTML == "X"){
        UI.deleteAccount(e.target.parentNode.parentNode.parentNode.parentNode);
    }
}

function updateAccounts(){
    newaccounts = [];
    var accounts = document.querySelector("tbody");

    for(var i = 0; i < accounts.children.length; i++){
        let acct = {};
        acct['id'] = accounts.children[i].id;
        acct['account'] = accounts.children[i].querySelector('.account').value;
        acct['type'] = accounts.children[i].querySelector('.type').value;
        acct['priority'] = accounts.children[i].querySelector('.priority').value;
        acct['retirement'] = accounts.children[i].querySelector('.retirement').checked;
        acct['savings'] = accounts.children[i].querySelector('.savings').checked;
        acct['inactive'] = accounts.children[i].querySelector('.inactive').checked;
        if(checkItem(acct["account"]) && checkType(acct["type"]) && checkPriority(acct["priority"])){
            newaccounts.push(acct);
        }
    }
    Async.updateAccounts(newaccounts);
}

/* Main Function */
const addButton = document.getElementById("add-accounts");
addButton.addEventListener("click", addAccount);

const submitButton = document.getElementById("submit-accounts");
submitButton.addEventListener("click", submitAccounts);

const clearButton = document.getElementById("clear-accounts");
clearButton.addEventListener("click", clearAccounts);

const updateButton = document.getElementById("update-accounts");
updateButton.addEventListener("click", updateAccounts);

const insertSection = document.getElementById("insert-accounts");
insertSection.addEventListener("click", deleteAccount);

const menuButton = document.getElementById("menu-button");
menuButton.addEventListener("click", toggleMenu);
