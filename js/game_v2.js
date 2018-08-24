const configModule = function() {
    let alphabetConf = {}
    let cardsConf = {}  
    //fix this too.
    function setAlphabet(response){
        alphabetConf = response.alphabetCost;
    }
    function getAlphabet(){
        return alphabetConf;
    }

    function addCard(response){
        //TODO fix this later.
        cardsConf.buyletter = response.buyletter;
        cardsConf.consolation = response.consolation;
        cardsConf.risk      = response.risk;
        cardsConf.revealcategory = response.revealcategory;
        cardsConf.discount = response.discount;
    }
    function getCards(){
        return cardsConf;
    }

    let result = {
        setAlphabet : setAlphabet,
        getAlphabet : getAlphabet,
        addCard : addCard,
        getCards : getCards
    }

    Object.defineProperty(result, 'alphabetConf', { set: setAlphabet });
    Object.defineProperty(result, 'cardsConf', {set : addCard});
    return result;
}();

sendRequest("GET","http://localhost:9000")
.then(responseData =>
    {
        configModule.setAlphabet(responseData);
        configModule.addCard(responseData);
    })
.catch(
    error => console.log(error)
)


const interfaceModule  = function(){
    function createElement(elem,attributes){
        let element = document.createElement(elem);
        attributes.forEach(x => {
          element.setAttribute(x[0],x[1]);
        });
        return element
    }
    
    function appendNestedElements(elem,childs){
      childs.forEach(element => {
        elem.appendChild(element)
      });
    }
    function changeColor(elem, color){
        elem.style.background= color;
    }
    return{
        createElement,
        appendNestedElements
    }
}();


function createEntryLayout(){
    let mainArea = document.getElementById("mainArea");

    let entryContainer = interfaceModule.createElement("div",[["class","container"]]);
    
    let ddlLevel = interfaceModule.createElement("select", [["id","levelSelect"]]);
    let optEasy  = interfaceModule.createElement("option",[["value","easy"]])
    let optMedium  = interfaceModule.createElement("option",[["value","medium"]])
    let optHard  = interfaceModule.createElement("option",[["value","hard"]])
    interfaceModule.appendNestedElements(ddlLevel,[optEasy,optMedium,optHard]);
    entryContainer.appendChild(ddlLevel);
    mainArea.appendChild(entryContainer);
}

createEntryLayout();

function createGameLayout() {
    let mainArea = document.getElementById("mainArea");
    let gameContainer = interfaceModule.createElement("div",[["class", "container"]]);
    let gameInfo = interfaceModule.createElement("div",[["class","information"]]);

    let gameStateHeader = interfaceModule.createElement("h3",[]);
    let gameStateImg    = interfaceModule.createElement("img",[["src","img/info-16.png"]]);
    let gameStateLabel  = interfaceModule.createElement("label",[["id","gameState"]]);

    interfaceModule.appendNestedElements(gameStateHeader,[gameStateImg,gameStateLabel]);
    gameInfo.appendChild(gameStateHeader);

    let userPointHeader = interfaceModule.createElement("h3",[]);
    let userPointImg    = interfaceModule.createElement("img",[["src","img/diamond24.png"]]);
    let userPointLabel  = interfaceModule.createElement("label",[["id","userPoint"]]);
    interfaceModule.appendNestedElements(userPointHeader,[userPointImg,userPointLabel]);
    
    let categoryHeader  = interfaceModule.createElement("h3",[]);
    categoryHeader.innerText = "Category: ";
    let categoryLabel = interfaceModule.createElement("label",[["id","category"]]);
    categoryHeader.appendChild(categoryLabel);
    gameInfo.appendChild(categoryHeader);

    let giveUpBtn = interfaceModule.createElement("button",[["id","giveUpBtn"]]);
    giveUpBtn.innerText = "Give Up";
    interfaceModule.appendNestedElements(gameInfo,[userPointHeader,giveUpBtn]);

    gameContainer.appendChild(gameInfo);

    let secretWordArea  = interfaceModule.createElement("div",[["class","game"]]);
    let secretWordHeader= interfaceModule.createElement("h2",[]);
    secretWordHeader.innerText = "Word: ";
    let secretWordLabel = interfaceModule.createElement("label",[["id", "secretWord"]]);
    secretWordHeader.appendChild(secretWordLabel);
    secretWordArea.appendChild(secretWordHeader);

    let alphabetArea = interfaceModule.createElement("div",[["id","alphabet"]]);

    let alphabet = configModule.getAlphabet();
    for (let key in alphabet) {
        let elem = interfaceModule.createElement("button", [["id", key]]);
        elem.innerText = key.toUpperCase() + ":" + alphabet[key];
        interfaceModule.appendNestedElements(alphabetArea, [elem]);
    }

    let cardArea     = interfaceModule.createElement("div",[["id","cardContainer"]]);
    let cards  = configModule.getCards();
    for (let key in cards) {
        //upper part of card div that holds the card name,info button
        let card = interfaceModule.createElement("div", [["class", "card"]]);
        let cardTopDiv = interfaceModule.createElement("div", [["class", "cardTop"]]);
        let infoBtn = interfaceModule.createElement("button", [["class", "info"]]);
        infoBtn.innerHTML = "<img src=\"img/information-symbol.png\">";
        let header = interfaceModule.createElement("h5", [["class", "none"]]);
        header.innerText = key.toUpperCase() + " CARD";
        interfaceModule.appendNestedElements(cardTopDiv, [infoBtn, header]);
    
        //bottom part of card div that holds the card cost limit and use button
        let cardBottomDiv = interfaceModule.createElement("div", [["class", "cardBottom"]]);
        let labelLimit = interfaceModule.createElement("label", []);
        labelLimit.innerHTML = "<img src=\"img/item-interconnections.png\">:"+ cards[key].usageLimit;
        let labelCost = interfaceModule.createElement("label", []);
        labelCost.innerHTML = "<img src=\"img/diamond24.png\"> :" + cards[key].cost;
        let useButton = interfaceModule.createElement("button", [["id", key]]);
        useButton.innerHTML = "<label>USE</label>";
    
        interfaceModule.appendNestedElements(cardBottomDiv, [labelLimit, labelCost, useButton]);
        interfaceModule.appendNestedElements(card, [cardTopDiv, cardBottomDiv]);
        interfaceModule.appendNestedElements(cardArea, [card]);
    }
    interfaceModule.appendNestedElements(gameContainer,[gameInfo,secretWordArea,alphabetArea]);
    interfaceModule.appendNestedElements(mainArea,[gameContainer,cardArea]);
    
    gameContainer.style.display = "none";
    cardArea.style.display = "none";
}
setTimeout(() => {
    createGameLayout();    
}, 500);

function sendRequest(method, url, body) {
    return new Promise(function (resolve, reject) {
        let req = new XMLHttpRequest();
        req.open(method, url);
        req.setRequestHeader("Content-type", "application/json");
        req.responseType = 'json';
        req.onload = function () {
            if (req.status === 200 || req.status===417) {
                resolve(req.response);
            }
            else {
                reject(Error(req.statusText));
            }
        };
        req.onerror = function () {
            reject(Error("Network Error"));
        };
        req.send(JSON.stringify(body));
    });
}
