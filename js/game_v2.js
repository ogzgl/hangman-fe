const configModule = function() {
    let alphabetConf = {}
    let cardsConf = {}  
    //fix this too.
    let ingameCards = {}
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
    function objectify(array) {
        return array.reduce(function(p, c) {
             p[c[0]] = c[1];
             return p;
        }, {});
    }    
    let result = {
        setAlphabet : setAlphabet,
        getAlphabet : getAlphabet,
        addCard : addCard,
        getCards : getCards,
        objectify
    }

    Object.defineProperty(result, 'alphabetConf', { set: setAlphabet });
    Object.defineProperty(result, 'cardsConf', {set : addCard});
    return result;
}();

let moveJson ={};
const gameInterfaceModule  = function(){
    function _checkCardUsability(response){
        let cards = configModule.getCards();
        for (const key of Object.keys(cards)) {
            if((response.userPoint<cards[key].lowerLimit) || (response.userPoint>cards[key].upperLimit)){
                document.getElementById(key).disabled = true;
                document.getElementById(key).style.background = 'yellow';
            }
            else{
                document.getElementById(key).disabled = false;
                document.getElementById(key).style.background = '#0D77B7';
            }
        }
    }

    function updateGameInfo(response){
        if(response.status === "OK"){
            console.log(response);
            document.getElementById("gameState").textContent=response.message.enabledCard;
            document.getElementById("userPoint").textContent=response.message.userPoint;
            document.getElementById("secretWord").textContent=response.message.hiddenWord;
            document.getElementById("category").textContent=response.message.category;
            _checkCardUsability(response.message);  
        }
        else{
            alert(response.message)            
        }
    }
    function _updateAlphabet(costDiscount){

    }

    function _createGameBtn(){
        let e = document.getElementById("ddlLevel");
        let selectedLevel = e.options[e.selectedIndex].value;
        let gameCreationJson = {level : selectedLevel}
        sendRequest("POST","http://localhost:9000/",gameCreationJson)
        .then( responseData => {
            if(responseData.status==="OK"){
                uiModule.createGameLayout();
                document.getElementById("entryContainer").style.display = "none";
                document.getElementById("gameContainer").style.display = "flex";
                document.getElementById("cardContainer").style.display = "flex";
                updateGameInfo(responseData);
                buttonAddEvent();
            }
            else{
                alert(responseData.message)
            }
        })
        .catch(
            error => alert(error)
        )
    }
    
    function _makeMove(){

    }
    function btnHandler(){
        console.log("deneme");
        switch(this.id){
            case  'createGameBtn' :
                
        }



    //     if(this.id==="createGameBtn"){
    //         let e = document.getElementById("ddlLevel");
    //         let selectedLevel = e.options[e.selectedIndex].value;
    //         let gameCreationJson = {level : selectedLevel}
    //         sendRequest("POST","http://localhost:9000/",gameCreationJson)
    //         .then( responseData => {
    //             if(responseData.status==="OK"){
    //                 uiModule.createGameLayout();
    //                 document.getElementById("entryContainer").style.display = "none";
    //                 document.getElementById("gameContainer").style.display = "flex";
    //                 document.getElementById("cardContainer").style.display = "flex";
    //                 updateGameInfo(responseData);
    //                 buttonAddEvent();
    //             }
    //             else{
    //                 alert(responseData.message)
    //             }
    //         })
    //         .catch(
    //             error => alert(error)
    //         )
    //     }
    //     let cardArea = document.querySelectorAll(".cardBottom");
    //     if(Array.from(cardArea).includes(this.parentElement)){
    //         if(this.id==="revealcategory"){
    //             sendRequest("POST","http://localhost:9000/play",{card:this.id})
    //             .then(responseData =>{
    //                 if(responseData.status==="OK"){
    //                     updateGameInfo(responseData);
    //                     this.disabled = true;
    //                     return;
    //                 }
    //             })
    //         }
    //         else{
    //             moveJson.card = this.id
    //         }
    //     }

    //     let alphabetArea = document.getElementById("alphabet");        
    //     if(this.parentElement==alphabetArea){
    //         moveJson.letter = this.id;
    //         console.log(moveJson);
    //         sendRequest("POST","http://localhost:9000/play",moveJson)
    //         .then(responseData =>{
    //             if(responseData.status==="OK"){
    //                 updateGameInfo(responseData);
    //                 responseData.message.isSuccess==="correct" 
    //                     ? uiModule.changeColor(this,'green') 
    //                     : uiModule.changeColor(this,'red');
    //                 this.disabled = true;
    //             }
    //         })
    //     }
    }

    return{
        updateGameInfo,
        btnHandler
    }
}();


function sendRequest(method, url, body) {
    return new Promise(function (resolve, reject) {
        let req = new XMLHttpRequest();
        req.open(method, url);
        req.setRequestHeader("Content-type", "application/json");
        req.responseType = 'json';
        req.onload = function () {
            if (req.status === 200) {
                resolve(req.response);
            }
            else if(req.status===417 || req.status===406){
                alert(req.response.message)
            }
            else {
                reject(Error(req.statusText));
            }
            moveJson={}
        };
        req.onerror = function () {
            reject(Error("Network Error"));
        };
        req.send(JSON.stringify(body));
    });
}

let uiModule = function(){
    createEntryLayout();
    function _createElement(elem,attributes){
        let element = document.createElement(elem);
        attributes.forEach(x => {
          element.setAttribute(x[0],x[1]);
        });
        return element
    }
    
    function _appendNestedElements(elem,childs){
      childs.forEach(element => {
        elem.appendChild(element)
      });
    }
    function changeColor(elem, color){
        elem.style.background= color;
    }
    function createEntryLayout(){
        let mainArea = document.getElementById("mainArea")
        let entryContainer = _createElement("div",[["class","entryContainer"],["id","entryContainer"]]);
        let welcomeHeader = _createElement("h1",[]);
        welcomeHeader.innerText = "Welcome to Hangman";
        let levelSelect = _createElement("select",[["id","ddlLevel"]]);
        let levels = ["easy","medium","hard"]
        let levelOptions=[]
        for(let i=0;i<levels.length;i++){
            levelOptions.push(_createElement("option",[["value",levels[i]]]));
            levelOptions[i].innerText = levels[i].toUpperCase();
        }
        _appendNestedElements(levelSelect,levelOptions);
        let creationBtn = _createElement("button",[["id","createGameBtn"],["class","giveUpBtn"]]);
        creationBtn.innerText = "Start Game";
        _appendNestedElements(entryContainer,[welcomeHeader,levelSelect,creationBtn]);
        mainArea.appendChild(entryContainer);
        document.getElementById("createGameBtn").addEventListener("click",gameInterfaceModule.btnHandler)
    }
    function createGameLayout() {
        //TODO handle this in a better way.
        let mainArea = document.getElementById("mainArea");
        let gameContainer = _createElement("div",[["class", "container"],["id","gameContainer"]]);
        let gameInfo = _createElement("div",[["class","information"]]);
    
        let gameStateHeader = _createElement("h3",[]);
        let gameStateImg    = _createElement("img",[["src","img/info-16.png"]]);
        let gameStateLabel  = _createElement("label",[["id","gameState"]]);
    
        _appendNestedElements(gameStateHeader,[gameStateImg,gameStateLabel]);
        gameInfo.appendChild(gameStateHeader);
    
        let userPointHeader = _createElement("h3",[]);
        let userPointImg    = _createElement("img",[["src","img/diamond24.png"]]);
        let userPointLabel  = _createElement("label",[["id","userPoint"]]);
        _appendNestedElements(userPointHeader,[userPointImg,userPointLabel]);
        
        let categoryHeader  = _createElement("h3",[]);
        categoryHeader.innerText = "Category: ";
        let categoryLabel = _createElement("label",[["id","category"]]);
        categoryHeader.appendChild(categoryLabel);
        gameInfo.appendChild(categoryHeader);
    
        let giveUpBtn = _createElement("button",[["class","giveUpBtn"],["id","giveUpBtn"]]);
        giveUpBtn.innerText = "Give Up";
        _appendNestedElements(gameInfo,[userPointHeader,giveUpBtn]);
    
        gameContainer.appendChild(gameInfo);
    
        let secretWordArea  = _createElement("div",[["class","game"]]);
        let secretWordHeader= _createElement("h2",[]);
        secretWordHeader.innerText = "Word: ";
        let secretWordLabel = _createElement("label",[["id", "secretWord"]]);
        secretWordHeader.appendChild(secretWordLabel);
        secretWordArea.appendChild(secretWordHeader);
    
        let alphabetArea = _createElement("div",[["id","alphabet"]]);
    
        let alphabet = configModule.getAlphabet();
        for (let key in alphabet) {
            let elem = _createElement("button", [["id", key]]);
            elem.innerText = key.toUpperCase() + ":" + alphabet[key];
            _appendNestedElements(alphabetArea, [elem]);
        }
    
        let cardArea     = _createElement("div",[["id","cardContainer"]]);
        let cards  = configModule.getCards();
        for (let key in cards) {
            //upper part of card div that holds the card name,info button
            let card = _createElement("div", [["class", "card"]]);
            let cardTopDiv = _createElement("div", [["class", "cardTop"]]);
            let infoBtn = _createElement("button", [["class", "info"]]);
            infoBtn.innerHTML = "<img src=\"img/information-symbol.png\">";
            let header = _createElement("h5", [["class", "none"]]);
            header.innerText = key.toUpperCase() + " CARD";
            _appendNestedElements(cardTopDiv, [infoBtn, header]);
        
            //bottom part of card div that holds the card cost limit and use button
            let cardBottomDiv = _createElement("div", [["class", "cardBottom"],["id","cardBottom"]]);
            let labelLimit = _createElement("label", []);
            labelLimit.innerHTML = "<img src=\"img/item-interconnections.png\">:"+ cards[key].usageLimit;
            let labelCost = _createElement("label", []);
            labelCost.innerHTML = "<img src=\"img/diamond24.png\"> :" + cards[key].cost;
            let useButton = _createElement("button", [["id", key]]);
            useButton.innerHTML = "<label>USE</label>";
        
            _appendNestedElements(cardBottomDiv, [labelLimit, labelCost, useButton]);
            _appendNestedElements(card, [cardTopDiv, cardBottomDiv]);
            _appendNestedElements(cardArea, [card]);
        }
        _appendNestedElements(gameContainer,[gameInfo,secretWordArea,alphabetArea]);
        _appendNestedElements(mainArea,[gameContainer,cardArea]);
        
        gameContainer.style.display = "none";
        cardArea.style.display = "none";
    }
    return{
        createEntryLayout,
        createGameLayout,
        changeColor
    }
}();




function buttonAddEvent() {
    let btns = document.getElementsByTagName("button");
    for (let i=0;i<btns.length;i++){
        btns[i].addEventListener('click',gameInterfaceModule.btnHandler);
    }
};

//for reading alphabet and card config.
sendRequest("GET","http://localhost:9000")
.then(responseData =>
    {
        configModule.setAlphabet(responseData);
        configModule.addCard(responseData);
    })
.catch(
    error => console.log(error)
)