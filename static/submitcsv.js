class Async{
    static sendFile(file){
        const xhr = new XMLHttpRequest();
        xhr.open("POST", `/api/expenses/insert/csv`);
        xhr.send(file);
        xhr.onload = (e) => {
            console.log("SUBMIT");
        };
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

function sendFile(){
    const file = document.getElementById("csv").files[0];
    console.log(file);
    Async.sendFile(file);
}

/* Main Function */
const menuButton = document.getElementById("menu-button");
menuButton.addEventListener("click", toggleMenu);

const submitButton = document.getElementById("submit-csv");
submitButton.addEventListener("click", sendFile);
