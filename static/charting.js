class Async{
    static getChart(begin, end){
        const xhr = new XMLHttpRequest();
        xhr.open("GET", `/api/networth/chart/${begin}/${end}`);
        xhr.send();
        xhr.onload = (e) => {
            UI.showChart(xhr.response);
        };
    }
}

class UI{
    static showChart(chart){
        const expensesSection = document.getElementById("chart");
        expensesSection.innerHTML = chart;
        UI.percentSVG();
    }

    static percentSVG(){
        const svg = document.querySelector("svg");
        svg.setAttribute("width", "100%");
        svg.setAttribute("height", "100%");
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

function checkDate(date){
    return /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(date);
}

function queryChart(){
    var fromDate = document.getElementById("from-date").value;
    var toDate = document.getElementById("to-date").value;

    if(!checkDate(fromDate)){
        fromDate = "2020-01-01";
    }
    if(!checkDate(toDate)){
        const today = new Date();
        toDate = today.toISOString().substring(0, 10); 
    }
    Async.getChart(fromDate, toDate);
}

/* Main Function */
const menuButton = document.getElementById("menu-button");
menuButton.addEventListener("click", toggleMenu);

const submitButton = document.getElementById("get-chart");
submitButton.addEventListener("click", queryChart);
