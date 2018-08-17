let alphabet = {
    'a': 18,
    'b': 8,
    'c': 12,
    'd': 10,
    'e': 20,
    'f': 8,
    'g': 9,
    'h': 10,
    'i': 16,
    'j': 5,
    'k': 6,
    'l': 13,
    'm': 10,
    'n': 15,
    'o': 15,
    'p': 10,
    'q': 5,
    'r': 16,
    's': 14,
    't': 18,
    'u': 11,
    'v': 6,
    'w': 6,
    'x': 5,
    'y': 8,
    'z': 5
};

let cards = {
    "risk": {cost: 8, limit: 2},
    "consolation": {cost: 5, limit: 1},
    "discount": {cost: 5, limit: 2},
    "buyletter": {cost: 20, limit: 1},
    "category": {cost: 5, limit: 1}
};


function requestHandler(method, url, body) {
    return new Promise(function (resolve, reject) {
        let req = new XMLHttpRequest();
        req.open(method, url);
        req.setRequestHeader("Content-type", "application/json");
        req.responseType = 'json';
        req.onload = function () {
            if (req.status === 200 || req.status === 417) {
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


//
// function reloadInfos(e) {
//     requestHandler('POST', "http://localhost:9000/", {letter: e})
//         .then(function (data) {
//
//                 console.log(data.message.userPoint)
//             }
//         )
//         .catch(error => console.log(error));
//     console.log("sent post");
// }


function createElem(elementType, attributes) {
    let elem = document.createElement(elementType);
    attributes.forEach(element => {
        elem.setAttribute(element[0], element[1]);
    });
    return elem;
}

function appendNestedElems(parent, childs) {
    childs.forEach(element => {
        parent.appendChild(element)
    });
}

function arrToObj(arr){
    const obj = {};
    for (let key of arr) {
         obj[key[0]] = key[1];
    }
    return obj;
}

function createLayout() {
    // let container = document.getElementsByClassName("container");

    // let infoTab = createElem("div", [["class", "information"]]);

    // let gameStateHeader = createElem("h3", []);
    // let gameStateImg = createElem("img", [["src", "img/info-16.png"]]);
    // let gameStateLabel = createElem("label", [["id", "gameState"]]);
    // appendNestedElems(gameStateHeader, [gameStateImg, gameStateLabel]);
    // let userPointHeader = createElem("h3", []);
    // let userPointImg = createElem("img", [["src", "img/diamond24.png"]]);
    // let userPointLabel = createElem("label", [["id", "userPoint"]]);
    // appendNestedElems(userPointHeader, [userPointImg, userPointLabel]);

    // let categoryHeader = createElem("h3", []);
    // categoryHeader.innerText = "Category : ";
    // let categoryLabel = createElem("label", [["id", "category"]]);
    // appendNestedElems(categoryHeader, [categoryLabel]);

    // appendNestedElems(infoTab, [gameStateHeader, userPointHeader, categoryHeader]);

    // let hiddenWordContainer = createElem("div",[["class","game"]]);
    // let hiddenHeader = createElem("h2",[]);
    // hiddenHeader.innerText = "Word: ";
    // let hiddenLabel = createElem("label",[["id","category"]]);
    // appendNestedElems(hiddenHeader,[hiddenLabel])
    // let giveUpBtn  = createElem("button",[["id","giveUpBtn"]]);
    // giveUpBtn.innerText = "Give Up";

    // appendNestedElems(hiddenWordContainer,[hiddenHeader,giveUpBtn])
    // appendNestedElems(container,[infoTab,hiddenWordContainer]);

    //creating alphabet.
    let alpha = document.getElementById("alphabet");
    for (let key in alphabet) {
        let elem = createElem("button", [["id", key]]);
        elem.innerText = key.toUpperCase() + ":" + alphabet[key];
        appendNestedElems(alpha, [elem]);
    }
    let cardsFromJson = {}
    requestHandler('POST', "http://localhost:9000/", {level: "easy"})
    .then( data => {
        cardsFromJson = arrToObj(data.message.remainingCards)
        console.log(cardsFromJson)
    })
    .catch(error => console.log(error));
    console.log("sent post");
    //creating card container.
    let cardContainer = document.getElementById("cardContainer");
    for (let key in cards) {
        console.log(key)
        //upper part of card div that holds the card name,info button
        let card = createElem("div", [["class", "card"]]);
        let cardTopDiv = createElem("div", [["class", "cardTop"]]);
        let infoBtn = createElem("button", [["class", "info"]]);
        infoBtn.innerHTML = "<img src=\"img/information-symbol.png\">";
        let header = createElem("h5", [["class", "none"]]);
        header.innerText = key.toUpperCase() + " CARD";
        appendNestedElems(cardTopDiv, [infoBtn, header]);

        //bottom part of card div that holds the card cost limit and use button
        let cardBottomDiv = createElem("div", [["class", "cardBottom"]]);
        let labelLimit = createElem("label", []);
        labelLimit.innerHTML = "<img src=\"img/item-interconnections.png\">:"+ cardsFromJson[key.toUpperCase()];
        let labelCost = createElem("label", []);
        labelCost.innerHTML = "<img src=\"img/diamond24.png\"> :" + cards[key].cost;
        let useButton = createElem("button", ["id", key]);
        useButton.innerHTML = "<label>USE</label>";

        appendNestedElems(cardBottomDiv, [labelLimit, labelCost, useButton]);
        appendNestedElems(card, [cardTopDiv, cardBottomDiv]);
        appendNestedElems(cardContainer, [card]);
    }
}

createLayout();

let alphabetContainer = document.getElementById("alphabet")
document.body.addEventListener('click', event => {
    if (event.target.nodeName === 'BUTTON') {
        if (alphabetContainer.contains(event.target)) {
            alert(event.target.id.toUpperCase() + ' pressed.')
        }
    }
});
