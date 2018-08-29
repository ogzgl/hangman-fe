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
        array.forEach(element => {
            ingameCards[element[0].toLowerCase()] = element[1]
        });
    }    
    function getIngameCards(){
        return ingameCards;
    }
    let result = {
        setAlphabet : setAlphabet,
        getAlphabet : getAlphabet,
        addCard : addCard,
        getCards : getCards,
        objectify, objectify,
        getIngameCards

    }

    Object.defineProperty(result, 'alphabetConf', { set: setAlphabet });
    Object.defineProperty(result, 'cardsConf', {set : addCard});
    Object.defineProperty(result, 'ingameCards', {set : objectify});
    return result;
}();

const gameInterfaceModule  = function(){
    let moveJson = {}
    function _checkCardUsability(response){
        let cards = configModule.getCards();
        let limitOfCards = configModule.getIngameCards();
        let cardToDisable = []
        for (const key of Object.keys(cards)) {
            if(!((response.userPoint<cards[key].lowerLimit) || (response.userPoint>cards[key].upperLimit)) && limitOfCards[key]!=0){
                cardToDisable.push(document.getElementById(key));
            }
        }
        _cardDisabler(cardToDisable);
        if(response.enabledCard!="No enabled card"){
            _cardDisabler([])
        }

    }
    
    function updateGameInfo(response){
        if(response.status === "OK"){
            document.getElementById("gameState").textContent=response.message.enabledCard;
            document.getElementById("userPoint").textContent=response.message.userPoint;
            document.getElementById("secretWord").textContent=response.message.hiddenWord;
            document.getElementById("category").textContent=response.message.category;
            configModule.objectify(response.message.cards);
            _updateCard();
            _checkCardUsability(response.message);
        }
        else{
            alert(response.message)            
        }
    }


    function _updateCard(){
        let cards = configModule.getIngameCards();
        for (const key of Object.keys(cards)) {
            document.getElementById(key+"CardLimit").innerText = cards[key];
        }
    }

    function _updateAlphabet(costDiscount){
        let alphabet = configModule.getAlphabet();
        for(let key of Object.keys(alphabet)){
            document.getElementById(key).innerText = key+":"+(alphabet[key]*(100-costDiscount)/100)
        }
    }
    function _cardDisabler(elements){
        let cardArea = Array.from(document.querySelectorAll(".cardBottom button"));
        cardArea.forEach(cardButton => {
            if(!elements.includes(cardButton)){
                cardButton.disabled=true;
                uiModule.changeColor(cardButton,'red');
            }
            else{
                cardButton.disabled=false;
                uiModule.changeColor(cardButton,'#0D77B7');
            }
        });
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

    function _isLetter(str) {
        return str.length === 1 && str.match(/[a-z]/i);
    }
    function _makeMove(btnID){
        if(btnID==='revealcategory'){
            moveJson.card= btnID;
            sendRequest("POST","http://localhost:9000/play",moveJson)
            .then(responseData => 
                updateGameInfo(responseData),
                moveJson={}
            )
            .catch(error => alert(error))
        }
        else{
            if(_isLetter(btnID)){
                moveJson.letter = btnID;
                sendRequest("POST","http://localhost:9000/play",moveJson)
                .then(responseData => {
                    updateGameInfo(responseData),
                    responseData.message.isSuccess==="correct" 
                        ? uiModule.changeColor(document.getElementById(btnID),'green') 
                        : uiModule.changeColor(document.getElementById(btnID),'red'),
                    document.getElementById(btnID).disabled = true;
                    moveJson={}
                })
                .catch(error=>alert(error));
            }
            else{
                if(moveJson.card!=undefined){
                    uiModule.changeColor(document.getElementById(moveJson.card),'#0D77B7')
                }
                // if(btnID==="discount"){
                //     _updateAlphabet(configModule.getCards())
                // }
                moveJson.card = btnID;
                console.log(moveJson.card);
                uiModule.changeColor(document.getElementById(btnID),'yellow');
            }
        }


    }

    function _giveUpBtn(){
        moveJson.giveUp = "yes";
        sendRequest("POST","http://localhost:9000/play",moveJson)
        .then(responseData =>{
            alert(responseData.message.info+" You "+responseData.message.state.toLowerCase());
        })
        .catch(error => alert(error));
    }
    function btnHandler(elem){
        if(elem==='createGameBtn') _createGameBtn();
        else if(elem==='giveUpBtn') _giveUpBtn();
        else _makeMove(elem)
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
        document.getElementById("createGameBtn").addEventListener("click",function(event){
            gameInterfaceModule.btnHandler(event.target.id)
        })
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
            let infoBtn = _createElement("button", [["class", "info"],["alt",cards[key].description]]);
            let infoBtnImg = _createElement("img",[["src","/img/information-symbol.png"]])
            _appendNestedElements(infoBtn,[infoBtnImg])
            let header = _createElement("h5", [["class", "none"]]);
            header.innerText = key.toUpperCase() + " CARD";
            _appendNestedElements(cardTopDiv, [infoBtn, header]);
        
            //bottom part of card div that holds the card cost limit and use button
            let cardBottomDiv = _createElement("div", [["class", "cardBottom"],["id","cardBottom"]]);
            let limitSpan = _createElement("span",[])
            let limitImage = _createElement("img", [["src","/img/item-interconnections.png"]])
            let labelLimit = _createElement("label", [["id",key+"CardLimit"]]);
            labelLimit.innerText = " : " + cards[key].usageLimit;
            _appendNestedElements(limitSpan,[limitImage,labelLimit])

            let costSpan = _createElement("span",[])
            let costImage= _createElement("img",[["src","/img/diamond24.png"]])
            let labelCost = _createElement("label", [["id","cardCost"]]);
            labelCost.innerText = " : " + cards[key].cost;
            _appendNestedElements(costSpan,[costImage,labelCost])
            let useButton = _createElement("button", [["id", key]]);
            useButton.innerText = "USE";
        
            _appendNestedElements(cardBottomDiv, [limitSpan, costSpan, useButton]);
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
    // let alph = document.getElementById("alphabet");
    // alph.addEventListener('click',function(event){
    //     if(event.target.type==="submit"){
    //         gameInterfaceModule.btnHandler(event.target.id);
    //     }
    // })
    // let cards = document.getElementById("cardContainer");
    // cards.addEventListener('click',function(event){
    //     if(event.target.type==="submit"){
    //         gameInterfaceModule.btnHandler(event.target.id);
    //     }
    // })
    document.addEventListener('click',function(event){
        if(event.target.type==='submit'){
            gameInterfaceModule.btnHandler(event.target.id);
        }
    })
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