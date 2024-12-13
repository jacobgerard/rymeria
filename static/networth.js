async function fetchNetworth(period){
    let response = await fetch(`/api/networth/accounts/${period}`);
    let user = await response.json();
    return user;
}

class Async{
    static updateNetworth(period, networth){
        const xhr = new XMLHttpRequest();
        xhr.open("POST", `/api/networth/update/${period}`);
        xhr.setRequestHeader('Content-Type', 'application/json')
        xhr.send(JSON.stringify(networth));
        xhr.onload = (e) => {
            if(JSON.parse(xhr.response).processed == "true"){
                console.log("UPDATED BUDGET DB");
            }
        };
    }

    static newNetworth(period){
        return new Promise(function (resolve, reject){
            const xhr = new XMLHttpRequest();
            xhr.open("POST", `/api/networth/new/${period}`);
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
        const newButton = document.getElementById("newnetworth");
        newButton.classList.remove("hidden");
    }

    static hideNewButton(){
        const newButton = document.getElementById("newnetworth");
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

    static showNetworth(assets, liabilities, totals){
        UI.clearNetworth();

        const networthSection = document.getElementById("networth");
        networthSection.innerHTML = `
            <table class="small-table w100">
                <thead>
                    <td class="bold">Category</td>
                    <td class="bold align-right">Amount</td>
                </thead>
                <tbody id="networthlines">
                    <tr>
                        <td>Assets</td>
                        <td class="align-right">${cents_to_dollars(totals.assets)}</td>
                    </tr>
                    <tr>
                        <td>Liabilities</td>
                        <td class="align-right">${cents_to_dollars(totals.liabilities)}</td>
                    </tr>
                    <tr class="top-border">
                        <td class="bold">Net Worth</td>
                        <td class="bold align-right">${cents_to_dollars(totals.net)}</td>
                    </tr>
                </tbody>
            </table>
        `;

        const assetsSection = document.getElementById("assets");
        assetsSection.innerHTML = `
            <table class="small-table w100">
                <thead>
                    <td class="bold">Asset</td>
                    <td class="bold align-right">Amount</td>
                </thead>
                <tbody id="assetlines">
                </tbody>
            </table>
        `;
        const assetLines = document.getElementById("assetlines");
        for(let i = 0; i < assets.length; i++){
            const newLine = document.createElement("tr");
            newLine.id = assets[i].id;
            newLine.innerHTML = `
                <td>${assets[i].account}</td>
                <td class="align-right"><input type="text" class="shrinker-input align-right amount" value="${cents_to_dollars(assets[i].amount)}"></input></td>
            `;
            assetLines.appendChild(newLine);
        }

        const liabilitySection = document.getElementById("liabilities");
        liabilitySection.innerHTML = `
            <table class="small-table w100">
                <thead>
                    <td class="bold">Liability</td>
                    <td class="bold align-right">Amount</td>
                </thead>
                <tbody id="liabilitylines">
                </tbody>
            </table>
        `;
        const liabilityLines = document.getElementById("liabilitylines");
        for(let i = 0; i < liabilities.length; i++){
            const newLine = document.createElement("tr");
            newLine.id = liabilities[i].id;
            newLine.innerHTML = `
                <td>${liabilities[i].account}</td>
                <td class="align-right"><input type="text" class="shrinker-input align-right amount" value="${cents_to_dollars(liabilities[i].amount)}"></input></td>
            `;
            liabilityLines.appendChild(newLine);
        }
    }

    static clearNetworth(){
        const networthSection = document.getElementById("networth");
        networthSection.innerHTML = '';
        const assetsSection = document.getElementById("assets");
        assetsSection.innerHTML = '';
        const liabilitiesSection = document.getElementById("liabilities");
        liabilitiesSection.innerHTML = '';
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

function networthSum(x, y){
    return x + y.amount;
}

function calculateTotals(networth, spent, delta){
    let totals = {};
    totals['networth'] = networth.reduce(networthSum, 0);
    return totals;
}

function cents_to_dollars(cents){
    if(cents < 0){
        return `${(0 - (Math.abs(cents) / 100)).toFixed(2)}`;
    }
    return `${(Math.abs(cents) / 100).toFixed(2)}`;
}

function checkAmount(amount){
    return /^[0-9\.]+$/.test(amount);
}

function filterType(rows, type){
    return rows.filter(function (row){
        return row['type'] == type;
    });
}

async function checkNetworth(){
    let year = document.getElementById("year").value;
    let month = document.getElementById("month").value;
    let period = `${year}-${month}`;
    let networth = await fetchNetworth(period);
    if(networth.length == 0){
        UI.hideUpdateButton();
        UI.showNewButton();
        UI.clearNetworth();
        return 0;
    }
    let assets = filterType(networth, 'A');
    let liabilities = filterType(networth, 'L');
    let totals = {};
    totals['assets'] = assets.reduce(networthSum, 0);
    totals['liabilities'] = liabilities.reduce(networthSum, 0);
    totals['net'] = totals['assets'] - totals['liabilities'];
    UI.showNetworth(assets, liabilities, totals);
    UI.showUpdateButton();
    UI.hideNewButton();
    return 0;
}

function updateNetworth(){
    let year = document.getElementById("year").value;
    let month = document.getElementById("month").value;
    let period = `${year}-${month}`;
    let newnetworth = [];
    const assetLines = document.getElementById("assetlines");
    const liabilityLines = document.getElementById("liabilitylines");

    for(let i = 0; i < assetLines.children.length; i++){
        let net = {};
        net["id"] = assetLines.children[i].id;
        net["amount"] = assetLines.children[i].querySelector(".amount").value;
        if(checkAmount(net["amount"])){
            newnetworth.push(net);
        }
    }
    for(let i = 0; i < liabilityLines.children.length; i++){
        let net = {};
        net["id"] = liabilityLines.children[i].id;
        net["amount"] = liabilityLines.children[i].querySelector(".amount").value;
        if(checkAmount(net["amount"])){
            newnetworth.push(net);
        }
    }
    Async.updateNetworth(period, newnetworth);
}

async function newNetworth(){
    let year = document.getElementById("year").value;
    let month = document.getElementById("month").value;
    let period = `${year}-${month}`;
    await Async.newNetworth(period);
    checkNetworth();
}

/* Main Function */
const menuButton = document.getElementById("menu-button");
menuButton.addEventListener("click", toggleMenu);

const submitButton = document.getElementById("query-networth");
submitButton.addEventListener("click", checkNetworth);

const updateButton = document.getElementById("update-networth");
updateButton.addEventListener("click", updateNetworth);

const newButton = document.getElementById("new-networth");
newButton.addEventListener("click", newNetworth);
