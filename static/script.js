class Async{
    static sendExpenses(expenses){
        const xhr = new XMLHttpRequest();
        xhr.open("POST", '/api/expenses/insert');
        xhr.setRequestHeader('Content-Type', 'application/json')
        xhr.send(JSON.stringify(expenses));
        xhr.onload = (e) => {
            if(JSON.parse(xhr.response).processed == "true"){
                UI.clearExpenses();        
            }
        };
    }
}

class UI{
    static addExpense(){
        const list = document.getElementById("insert-expenses"); 
        const categoriesall = sortObjectByValue(JSON.parse(sessionStorage.getItem("categories")));
        const categories = activeCategories(categoriesall);
        const expense = document.createElement("div");
        expense.className = "box horv";
        expense.innerHTML = `
            <div class="label">
                <label class="block">Date</label>
                <input type="date" class="input date"></input>
            </div>
            <div class="label">
                <label class="block">Item</label>
                <input type="text" class="input item"></input>
            </div>
            <div class="label">
                <label class="block">Category</label>
                <select class="select input category">
                </select>
                </div>
                <div class="horizontal">
                    <div class="even label">
                        <label class="block">Amount</label>
                        <input type="text" class="shrink-input block amount"></input>
                    </div>
                    <div class="even label">
                        <label class="block">Delete</label>
                        <button class="inline-button">X</button>
                    </div>
                </div>
            </div>
        `;
        const select = expense.querySelector(".select");
        for(let cat in categories){
            const opt = document.createElement("option");
            opt.value = categories[cat]['id'];
            opt.innerHTML = categories[cat]['category'];
            select.appendChild(opt);
        }
        list.appendChild(expense);
    }

    static fillOriginalSelect(categories){
        const select = document.querySelector(".select");
        for(let cat in categories){
            const opt = document.createElement("option");
            opt.value = categories[cat]['id'];
            opt.innerHTML = categories[cat]['category'];
            select.appendChild(opt);
        }
    }

    static clearExpenses(){
        const list = document.getElementById("insert-expenses"); 
        list.innerHTML = "";
        UI.addExpense();
    }

    static deleteExpense(exp){
        exp.remove();
    }
}

function activeCategories(categories){
    return categories.filter((cat) => cat["inactive"] == false); 
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

function addEmptyExpense(){
    UI.addExpense();
}

function submitExpenses(e){
    expenses = [];
    const insert = document.getElementById("insert-expenses");
    for(let i = 0; i < insert.children.length; i++){
        let exp = {};
        exp["date"] = insert.children[i].querySelector(".date").value;
        exp["item"] = insert.children[i].querySelector(".item").value;
        exp["category"] = insert.children[i].querySelector(".category").value;
        exp["amount"] = insert.children[i].querySelector(".amount").value;
        if(checkDate(exp["date"]) && checkItem(exp["item"]) && checkAmount(exp["amount"])){
            expenses.push(exp);
        }
    }
    Async.sendExpenses(expenses);
}

function clearExpenses(){
    UI.clearExpenses();
}

function deleteExpense(e){
    if(e.target.innerHTML == "X"){
        UI.deleteExpense(e.target.parentNode.parentNode.parentNode);
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

function sortObjectByValue(obj){
    let sortobj = [];
    for(let item in obj){
        sortobj.push(obj[item]);
    }
    return sortobj.sort(function (a, b){
        return a['priority'] - b['priority'];
    });
}

/* TESTING NEW FETCH BLOCK*/
async function loadCategories(){
    let categories;

    if(sessionStorage.getItem("categories") === null) {
        try{
            let response = await fetch(`/api/categories`);
            if(!response.ok){
                throw new Error("Unable to load categories");
            }
            categories = await response.json();
        } catch(error){
            console.log(error);
            return error;
        }
        sessionStorage.setItem("categories", JSON.stringify(categories));
    } else{
        categories = JSON.parse(sessionStorage.getItem("categories"));
    }

    categories = activeCategories(categories);
    let sorted = sortObjectByValue(categories);
    UI.fillOriginalSelect(sorted);
    return categories;
}

/* Main Function */
loadCategories();

const addButton = document.getElementById("add-expense");
addButton.addEventListener("click", addEmptyExpense);

const submitButton = document.getElementById("submit-expenses");
submitButton.addEventListener("click", submitExpenses);

const clearButton = document.getElementById("clear-expenses");
clearButton.addEventListener("click", clearExpenses);

const insertSection = document.getElementById("insert-expenses");
insertSection.addEventListener("click", deleteExpense);

const menuButton = document.getElementById("menu-button");
menuButton.addEventListener("click", toggleMenu);
