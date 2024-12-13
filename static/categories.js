class Async{
    static sendCategories(categories){
        const xhr = new XMLHttpRequest();
        xhr.open("POST", '/api/categories/insert');
        xhr.setRequestHeader('Content-Type', 'application/json')
        xhr.send(JSON.stringify(categories));
        xhr.onload = (e) => {
            if(JSON.parse(xhr.response).processed == "true"){
                UI.clearCategories();        
            }
        };
    }

    static updateCategories(categories){
        const xhr = new XMLHttpRequest();
        xhr.open("POST", '/api/categories/update');
        xhr.setRequestHeader('Content-Type', 'application/json')
        xhr.send(JSON.stringify(categories));
        xhr.onload = (e) => {
            if(JSON.parse(xhr.response).processed == "true"){
                console.log("UPDATED");
                loadCategories();
            }
        };
    }
}

class UI{
    static emptyCategory = `
        <div class="label">
            <label class="block">Category</label>
            <input type="text" class="input category"></input>
            <label class="block">Type</label>
            <input type="text" class="input type"></input>
            <label class="block">Priority</label>
            <input type="text" class="input priority"></input>
            <div class="horizontal">
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

    static addEmptyCategory(){
        const list = document.getElementById("insert-categories"); 
        const category = document.createElement("div");
        category.className = "box horv";
        category.innerHTML = UI.emptyCategory;
        list.appendChild(category);
    }

    static clearCategories(){
        const list = document.getElementById("insert-categories"); 
        list.innerHTML = "";
        const category = document.createElement("div");
        category.className = "box horv";
        category.innerHTML = UI.emptyCategory;
        list.appendChild(category);
    }

    static deleteCategory(cat){
        cat.remove();
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

function addCategory(){
    UI.addEmptyCategory();
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

function submitCategories(){
    categories = [];
    const insert = document.getElementById("insert-categories");
    for(let i = 0; i < insert.children.length; i++){
        let cat = {};
        cat["category"] = insert.children[i].querySelector(".category").value;
        cat["type"] = insert.children[i].querySelector(".type").value;
        cat["priority"] = insert.children[i].querySelector(".priority").value;
        cat["inactive"] = insert.children[i].querySelector(".inactive").checked;
        if(checkItem(cat["category"]) && checkType(cat["type"]) && checkPriority(cat["priority"])){
            categories.push(cat);
        }
    }
    Async.sendCategories(categories);
}

function clearCategories(){
    UI.clearCategories(); 
}

function deleteCategory(e){
    if(e.target.innerHTML == "X"){
        UI.deleteCategory(e.target.parentNode.parentNode.parentNode.parentNode);
    }
}

function updateCategories(){
    newcategories = [];
    var categories = document.querySelector("tbody");

    for(var i = 0; i < categories.children.length; i++){
        let cat = {};
        cat['id'] = categories.children[i].id;
        cat['category'] = categories.children[i].querySelector('.category').value;
        cat['type'] = categories.children[i].querySelector('.type').value;
        cat['priority'] = categories.children[i].querySelector('.priority').value;
        cat['inactive'] = categories.children[i].querySelector('.inactive').checked;
        if(checkItem(cat["category"]) && checkType(cat["type"]) && checkPriority(cat["priority"])){
            newcategories.push(cat);
        }
    }
    Async.updateCategories(newcategories);
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
    return categories;
}

/* Main Function */
loadCategories();

const addButton = document.getElementById("add-category");
addButton.addEventListener("click", addCategory);

const submitButton = document.getElementById("submit-categories");
submitButton.addEventListener("click", submitCategories);

const clearButton = document.getElementById("clear-categories");
clearButton.addEventListener("click", clearCategories);

const updateButton = document.getElementById("update-categories");
updateButton.addEventListener("click", updateCategories);

const insertSection = document.getElementById("insert-categories");
insertSection.addEventListener("click", deleteCategory);

const menuButton = document.getElementById("menu-button");
menuButton.addEventListener("click", toggleMenu);
