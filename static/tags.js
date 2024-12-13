class Async{
    static sendTags(tags){
        const xhr = new XMLHttpRequest();
        xhr.open("POST", '/api/tags/insert');
        xhr.setRequestHeader('Content-Type', 'application/json')
        xhr.send(JSON.stringify(tags));
        xhr.onload = (e) => {
            if(JSON.parse(xhr.response).processed == "true"){
                UI.clearTags();        
            }
        };
    }

    static updateTags(tags){
        const xhr = new XMLHttpRequest();
        xhr.open("POST", '/api/tags/update');
        xhr.setRequestHeader('Content-Type', 'application/json')
        xhr.send(JSON.stringify(tags));
        xhr.onload = (e) => {
            if(JSON.parse(xhr.response).processed == "true"){
                console.log("UPDATED");
            }
        };
    }
}

class UI{
    static emptyTag = `
        <div class="label">
            <label class="block">Tag</label>
            <input type="text" class="input tag"></input>
        </div>
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
    `;

    static addEmptyTag(){
        const list = document.getElementById("insert-tags"); 
        const account = document.createElement("div");
        account.className = "box horv";
        account.innerHTML = UI.emptyTag;
        list.appendChild(account);
    }

    static clearTags(){
        const list = document.getElementById("insert-tags"); 
        list.innerHTML = "";
        const account = document.createElement("div");
        account.className = "box horv";
        account.innerHTML = UI.emptyTag;
        list.appendChild(account);
    }

    static deleteTag(tag){
        tag.remove();
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

function addTag(){
    UI.addEmptyTag();
}

function checkTag(tag){
    return /^.{1,255}$/.test(tag);
}

function submitTags(){
    tags = [];
    const insert = document.getElementById("insert-tags");
    for(let i = 0; i < insert.children.length; i++){
        let t = {};
        t["tag"] = insert.children[i].querySelector(".tag").value;
        t["inactive"] = insert.children[i].querySelector(".inactive").checked;
        if(checkTag(t["tag"])){
            tags.push(t);
        }
    }
    console.log(tags);
    Async.sendTags(tags);
}

function clearTags(){
    UI.clearTags(); 
}

function deleteTag(e){
    if(e.target.innerHTML == "X"){
        UI.deleteTag(e.target.parentNode.parentNode.parentNode);
    }
}

function updateTags(){
    newtags = [];
    var tags = document.querySelector("tbody");

    for(var i = 0; i < tags.children.length; i++){
        let t = {};
        t['id'] = tags.children[i].id;
        t['tag'] = tags.children[i].querySelector('.tag').value;
        t['inactive'] = tags.children[i].querySelector('.inactive').checked;
        if(checkTag(t["tag"])){
            newtags.push(t);
        }
    }
    Async.updateTags(newtags);
}

/* Main Function */
const addButton = document.getElementById("add-tags");
addButton.addEventListener("click", addTag);

const submitButton = document.getElementById("submit-tags");
submitButton.addEventListener("click", submitTags);

const clearButton = document.getElementById("clear-tags");
clearButton.addEventListener("click", clearTags);

const updateButton = document.getElementById("update-tags");
updateButton.addEventListener("click", updateTags);

const insertSection = document.getElementById("insert-tags");
insertSection.addEventListener("click", deleteTag);

const menuButton = document.getElementById("menu-button");
menuButton.addEventListener("click", toggleMenu);
