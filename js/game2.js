function requestHandler(method, url, body) {
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

let alphabet = {
    a:5
};
let cards = {
    "risk": {cost: 8, limit: 2},
    "consolation": {cost: 5, limit: 1},
    "discount": {cost: 5, limit: 2},
    "buyletter": {cost: 20, limit: 1},
    "category": {cost: 5, limit: 1}
};

function createElem(elem,attributes){
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


function createGameLayout() {
    let mainArea = document.getElementById("mainArea");
    let gameContainer = createElem("div",[["class", "container"]]);
    let gameInfo = createElem("div",[["class","information"]]);

    let gameStateHeader = createElem("h3",[]);
    let gameStateImg    = createElem("img",[["src","img/info-16.png"]]);
    let gameStateLabel  = createElem("label",[["id","gameState"]]);

    appendNestedElements(gameStateHeader,[gameStateImg,gameStateLabel]);
    gameInfo.appendChild(gameStateHeader);

    let userPointHeader = createElem("h3",[]);
    let userPointImg    = createElem("img",[["src","img/diamond24.png"]]);
    let userPointLabel  = createElem("label",[["id","userPoint"]]);
    appendNestedElements(userPointHeader,[userPointImg,userPointLabel]);
    
    let categoryHeader  = createElem("h3",[]);
    categoryHeader.innerText = "Category: ";
    let categoryLabel = createElem("label",[["id","category"]]);
    categoryHeader.appendChild(categoryLabel);
    gameInfo.appendChild(categoryHeader);

    let giveUpBtn = createElem("button",[["id","giveUpBtn"]]);
    giveUpBtn.innerText = "Give Up";
    appendNestedElements(gameInfo,[userPointHeader,giveUpBtn]);



    gameContainer.appendChild(gameInfo);

    let secretWordArea  = createElem("div",[["class","game"]]);
    let secretWordHeader= createElem("h2",[]);
    secretWordHeader.innerText = "Word: ";
    let secretWordLabel = createElem("label",[["id", "secretWord"]]);
    secretWordHeader.appendChild(secretWordLabel);
    secretWordArea.appendChild(secretWordHeader);

    let alphabetArea = createElem("div",[["id","alphabet"]]);
    let cardArea     = createElem("div",[["id","cardContainer"]]);


    for (let key in alphabet) {
        let elem = createElem("button", [["id", key]]);
        elem.innerText = key.toUpperCase() + ":" + alphabet[key];
        appendNestedElements(alphabetArea, [elem]);
    }

    for (let key in cards) {
        //upper part of card div that holds the card name,info button
        let card = createElem("div", [["class", "card"]]);
        let cardTopDiv = createElem("div", [["class", "cardTop"]]);
        let infoBtn = createElem("button", [["class", "info"]]);
        infoBtn.innerHTML = "<img src=\"img/information-symbol.png\">";
        let header = createElem("h5", [["class", "none"]]);
        header.innerText = key.toUpperCase() + " CARD";
        appendNestedElements(cardTopDiv, [infoBtn, header]);
    
        //bottom part of card div that holds the card cost limit and use button
        let cardBottomDiv = createElem("div", [["class", "cardBottom"]]);
        let labelLimit = createElem("label", []);
        labelLimit.innerHTML = "<img src=\"img/item-interconnections.png\">:"+ cards[key].limit;
        let labelCost = createElem("label", []);
        labelCost.innerHTML = "<img src=\"img/diamond24.png\"> :" + cards[key].cost;
        let useButton = createElem("button", [["id", key]]);
        useButton.innerHTML = "<label>USE</label>";
    
        appendNestedElements(cardBottomDiv, [labelLimit, labelCost, useButton]);
        appendNestedElements(card, [cardTopDiv, cardBottomDiv]);
        appendNestedElements(cardArea, [card]);
    }
    appendNestedElements(gameContainer,[gameInfo,secretWordArea,alphabetArea]);
    appendNestedElements(mainArea,[gameContainer,cardArea]);
  
}

createGameLayout();

// function createEntryLayout() {
//
// }

window.addEventListener('load', function() {
    requestHandler('POST', "http://localhost:9000/", {level: "easy"})
    .then( data => {
        console.log(data);
        document.getElementById("userPoint").textContent = " " + data.message.userPoint;
        document.getElementById("category").textContent = " " + data.message.category;
        document.getElementById("secretWord").textContent =" " + data.message.hiddenWord;
        document.getElementById("gameState").textContent  = " " + data.message.gameState;
        
    })
    .catch(error => console.log(error));
});

function changeColor(guess,result){
    if(result==="correct"){
        guess.style.background = "green";
        guess.disabled = true;
    }
    if(result==="incorrect"){
        guess.style.background = "red";
        guess.disabled = true;
    }
}

let alphabetContainer = document.getElementById("alphabet");
document.body.addEventListener('click', event => {
    if (event.target.nodeName === 'BUTTON') {
        if (alphabetContainer.contains(event.target)) {
            // alert(event.target.id.toUpperCase() + ' pressed.');
            requestHandler("POST","http://localhost:9000/play",{letter : event.target.id})  
            .then(responseData => {
                if(responseData.status === "OK"){
                    document.getElementById("userPoint").textContent = " " + responseData.message.userPoint;
                    document.getElementById("category").textContent = " " + responseData.message.category;
                    document.getElementById("secretWord").textContent =" " + responseData.message.hiddenWord;
                    document.getElementById("gameState").textContent  = " " + responseData.message.gameState;
                    changeColor(event.target,responseData.message.isSuccess);
                }
                else if(responseData.status === "DONE"){
                    alert(responseData.message.info);
                }
                else if(responseData.status === "EXKO"){
                    alert(responseData.message);
                }
            })
        }
    }
});

// let cardContainer = document.getElementById("cardContainer");
// document.body.addEventListener('click', event =>{
//     if (event.target.nodeName === 'BUTTON'){
//         if(cardContainer.contains(event.target)){

//         }
//     }
// });


document.getElementById("giveUpBtn").addEventListener('click',event => {
    requestHandler("POST","http://localhost:9000/play",{giveUp : "yes"})
    .then(responseData => {
        alert(responseData.message.info);
    })
});