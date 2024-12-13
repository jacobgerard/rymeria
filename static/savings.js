class Async{
    static sendGoals(goals){
        const xhr = new XMLHttpRequest();
        xhr.open("POST", '/api/goals/insert');
        xhr.setRequestHeader('Content-Type', 'application/json')
        xhr.send(JSON.stringify(goals));
        xhr.onload = (e) => {
            if(JSON.parse(xhr.response).processed == "true"){
                console.log("processed true");       
            }
        };
    }
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

function checkSavings(e){
    var fromDate = document.getElementById("from-date").value;
    var toDate = document.getElementById("to-date").value;

    if(!checkDate(fromDate)){
        fromDate = "2020-01-01";
    }
    if(!checkDate(toDate)){
        const today = new Date();
        toDate = today.toISOString().substring(0, 10); 
    }

    base = "/savings/" + fromDate + "/" + toDate + "/";
    console.log(base);
    window.location.href = base;
}

function addGoal(e){
    console.log(e);
    goals = [];
    const insert = document.getElementById("goal-list");
    for(let i = 0; i < insert.children.length; i++){
        let goal = {};
        goal["id"] = insert.children[i].id;
        goal["amount"] = insert.children[i].querySelector(".amount").value;
        goal["goal-amount"] = insert.children[i].querySelector(".goal-amount").value;
        goal["goal-date"] = insert.children[i].querySelector(".goal-date").value;
        goal["goal"] = insert.children[i].querySelector(".goal").value;
        goals.push(goal);
    }
    console.log(goals);
    Async.sendGoals(goals);
}

/* Main Function */
const menuButton = document.getElementById("menu-button");
menuButton.addEventListener("click", toggleMenu);

const submitButton = document.getElementById("query-savings");
submitButton.addEventListener("click", checkSavings);

const newGoal = document.getElementById("add-goal");
newGoal.addEventListener("click", addGoal);
