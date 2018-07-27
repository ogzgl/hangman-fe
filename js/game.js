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
    "buy a letter": {cost: 20, limit: 1},
    "category": {cost: 5, limit: 1}
};


// function createElem(...args){ //elemType, id, class, innerHTML
//     let elem = document.createElement(args[0])
//     elem.setAttribute("id", args[1]);
//
// }

let alpha = document.getElementById("alphabet");
for (let key in alphabet) {
    let elem = document.createElement("button");
    elem.setAttribute("id", key);
    elem.innerText = key.toUpperCase() + ":" + alphabet[key];
    alpha.appendChild(elem);
}


function createElem(...args) { //type,id,innerHTML, Class

}

function appendNested(...args) { //container, childs..

}

let cardContainer = document.getElementById("cardContainer");
for (let key in cards) {
    let card = document.createElement("div");
    card.setAttribute("class", "card");

    let cardTopDiv = document.createElement("div");
    let infoBtn = document.createElement("button");
    let header = document.createElement("h4");

    header.setAttribute("class", "none");

    cardTopDiv.setAttribute("class", "cardTop");
    infoBtn.setAttribute("class", "info");
    infoBtn.innerHTML = "<img src=\"img/information-symbol.png\">";
    header.innerHTML = key.toUpperCase();
    cardTopDiv.appendChild(infoBtn);
    cardTopDiv.appendChild(header);

    let cardBottomDiv = document.createElement("div");
    cardBottomDiv.setAttribute("class", "cardBottom");
    let labelLimit = document.createElement("label");
    let labelCost = document.createElement("label");
    let useButton = document.createElement("button");
    useButton.innerHTML = "<label>USE</label>";
    useButton.setAttribute("id", key);

    labelLimit.innerHTML = "<img src=\"img/item-interconnections.png\">:" + cards[key].limit;
    labelCost.innerHTML = "<img src=\"img/diamond24.png\"> :" + cards[key].cost;

    cardBottomDiv.appendChild(labelLimit);
    cardBottomDiv.appendChild(labelCost);
    cardBottomDiv.appendChild(useButton);

    card.appendChild(cardTopDiv);
    card.appendChild(cardBottomDiv);
    cardContainer.appendChild(card);
}


document.body.addEventListener('click', event => {
    if (event.target.nodeName === 'BUTTON') {
        alert(event.target.id.toUpperCase() + ' pressed.')
    }
});
