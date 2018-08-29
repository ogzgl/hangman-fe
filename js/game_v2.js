const configModule = function() {
    let alphabetConf = {}
    let cardsConf = {}  
    let ingameCards = {}
    function setAlphabet(response){
        alphabetConf = response.alphabetCost;
    }
    function getAlphabet(){
        return alphabetConf;
    }

    function addCard(response){
        cardsConf.buyletter = response.buyletter;
        cardsConf.consolation = response.consolation;
        cardsConf.risk      = response.risk;
        cardsConf.revealcategory = response.revealcategory;
        cardsConf.discount = response.discount;
    }
    function getCards(){
        return cardsConf;
    }
    function getDiscount(card){
        return cardsConf[card].discount;
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
        getIngameCards,
        getDiscount

    }

    Object.defineProperty(result, 'alphabetConf', { set: setAlphabet });
    Object.defineProperty(result, 'cardsConf', {set : addCard});
    Object.defineProperty(result, 'ingameCards', {set : objectify});
    return result;
}();

let uiModule = function(){
    createEntryLayout();
    function createElement(elem,attributes){
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
        let modalContainer = createElement("div",[["class","modal"]]);
        let entryContainer = createElement("div",[["class","entryContainer"],["id","entryContainer"]]);
        let closeBtn = createElement("span",[["class","close"]]);
        let welcomeHeader = createElement("h1",[]);
        welcomeHeader.innerText = "Welcome to Hangman";
        let levelSelect = createElement("select",[["id","ddlLevel"]]);
        let levels = ["easy","medium","hard"]
        let levelOptions=[]
        for(let i=0;i<levels.length;i++){
            levelOptions.push(createElement("option",[["value",levels[i]]]));
            levelOptions[i].innerText = levels[i].toUpperCase();
        }
        _appendNestedElements(levelSelect,levelOptions);
        let creationBtn = createElement("button",[["id","createGameBtn"],["class","giveUpBtn"]]);
        creationBtn.innerText = "Start Game";
        _appendNestedElements(entryContainer,[closeBtn,welcomeHeader,levelSelect,creationBtn]);
        modalContainer.appendChild(entryContainer);
        mainArea.appendChild(entryContainer);
        document.getElementById("createGameBtn").addEventListener("click",function(event){
            gameInterfaceModule.btnHandler(event.target.id)
        })
    }
    function createGameLayout() {
        //TODO handle this in a better way.
        let mainArea = document.getElementById("mainArea");
        let gameContainer = createElement("div",[["class", "container"],["id","gameContainer"]]);
        let gameInfo = createElement("div",[["class","information"]]);
    
        let gameStateHeader = createElement("h3",[]);
        let gameStateImg    = createElement("img",[["src","img/info-16.png"]]);
        let gameStateLabel  = createElement("label",[["id","gameState"]]);
    
        _appendNestedElements(gameStateHeader,[gameStateImg,gameStateLabel]);
        gameInfo.appendChild(gameStateHeader);
    
        let userPointHeader = createElement("h3",[]);
        let userPointImg    = createElement("img",[["src","img/diamond24.png"]]);
        let userPointLabel  = createElement("label",[["id","userPoint"]]);
        _appendNestedElements(userPointHeader,[userPointImg,userPointLabel]);
        
        let categoryHeader  = createElement("h3",[]);
        categoryHeader.innerText = "Category: ";
        let categoryLabel = createElement("label",[["id","category"]]);
        categoryHeader.appendChild(categoryLabel);
        gameInfo.appendChild(categoryHeader);
    
        let giveUpBtn = createElement("button",[["class","giveUpBtn"],["id","giveUpBtn"]]);
        giveUpBtn.innerText = "Give Up";
        _appendNestedElements(gameInfo,[userPointHeader,giveUpBtn]);
    
        gameContainer.appendChild(gameInfo);
    
        let secretWordArea  = createElement("div",[["class","game"]]);
        let secretWordHeader= createElement("h2",[]);
        secretWordHeader.innerText = "Word: ";
        let secretWordLabel = createElement("span",[["id", "secretWord"],["class","secretWordGame"]]);
        secretWordHeader.appendChild(secretWordLabel);
        secretWordArea.appendChild(secretWordHeader);
    
        let alphabetArea = createElement("div",[["id","alphabet"]]);
    
        let alphabet = configModule.getAlphabet();
        for (let key in alphabet) {
            let elem = createElement("button", [["id", key],["class","availableButton"]]);
            elem.innerText = key.toUpperCase() + ":" + alphabet[key];
            _appendNestedElements(alphabetArea, [elem]);
        }
    
        let cardArea     = createElement("div",[["id","cardContainer"]]);
        let cards  = configModule.getCards();
        for (let key in cards) {
            //upper part of card div that holds the card name,info button
            let card = createElement("div", [["class", "card"]]);
            let cardTopDiv = createElement("div", [["class", "cardTop"]]);
            let infoBtn = createElement("button", [["class", "info"],["title",cards[key].description],["disabled","true"]]);
            let infoBtnImg = createElement("img",[["src","/img/information-symbol.png"]])
            _appendNestedElements(infoBtn,[infoBtnImg])
            let header = createElement("h5", [["class", "none"]]);
            header.innerText = key.toUpperCase() + " CARD";
            _appendNestedElements(cardTopDiv, [infoBtn, header]);
        
            //bottom part of card div that holds the card cost limit and use button
            let cardBottomDiv = createElement("div", [["class", "cardBottom"],["id","cardBottom"]]);
            let limitSpan = createElement("span",[])
            let limitImage = createElement("img", [["src","/img/item-interconnections.png"]])
            let labelLimit = createElement("label", [["id",key+"CardLimit"]]);
            labelLimit.innerText = " : " + cards[key].usageLimit;
            _appendNestedElements(limitSpan,[limitImage,labelLimit])

            let costSpan = createElement("span",[])
            let costImage= createElement("img",[["src","/img/diamond24.png"]])
            let labelCost = createElement("label", [["id","cardCost"]]);
            labelCost.innerText = " : " + cards[key].cost;
            _appendNestedElements(costSpan,[costImage,labelCost])
            let useButton = createElement("button", [["id", key]]);
            useButton.innerText = "USE";
        
            _appendNestedElements(cardBottomDiv, [limitSpan, costSpan, useButton]);
            _appendNestedElements(card, [cardTopDiv, cardBottomDiv]);
            _appendNestedElements(cardArea, [card]);
        }
        _appendNestedElements(gameContainer,[gameInfo,secretWordArea,alphabetArea]);
        _appendNestedElements(mainArea,[gameContainer,cardArea]);
        
    }
    return{
        createEntryLayout,
        createGameLayout,
        changeColor,
        createElement
    }
}();

const gameInterfaceModule  = function(){
    let moveJson = {}

    function _alphabetUsage(active){
        const alphabetButtons = document.getElementById("alphabet").children;
        for(let child of alphabetButtons){
            if(!active && child.className=="availableButton"){
                child.disabled = true;
                child.className = "disabledButton";
            }
            if(active && child.className=="disabledButton"){
                child.disabled=false;
                child.className = "availableButton";
            }
        }
    }

    function _updateAlphabetConds(enabledCardContext){
        if(enabledCardContext.includes("RISK")){
            _updateAlphabet(configModule.getDiscount('risk'))
        }
        else if(enabledCardContext.includes('CONSOLATION')){
            _updateAlphabet(configModule.getDiscount('consolation'))
        }
        else{
            _updateAlphabet(0)
        }
    }
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
    
    function _secretWordSeperation(hiddenWord){
        let elem = document.getElementById("secretWord");
        while(elem.firstChild){
            elem.removeChild(elem.firstChild);
        }
        for(let i=0;i<hiddenWord.length;i++){
            let charElem = uiModule.createElement("span",[["id",i]]);
            charElem.textContent = hiddenWord[i];
            elem.appendChild(charElem);
        }
    }

    function updateGameInfo(response){
        if(response.status === "OK"){
            document.getElementById("gameState").textContent=response.message.enabledCard;
            document.getElementById("userPoint").textContent=response.message.userPoint;
            _secretWordSeperation(response.message.hiddenWord);
            document.getElementById("category").textContent=response.message.category;
            configModule.objectify(response.message.cards);
            _updateCard();
            _checkCardUsability(response.message);
            _updateAlphabetConds(response.message.enabledCard);
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
            document.getElementById(key).innerText = key.toUpperCase()+":"+Math.floor(alphabet[key]*(100-costDiscount)/100)
        }
    }
    function _cardDisabler(elements){
        let cardArea = Array.from(document.querySelectorAll(".cardBottom button"));
        cardArea.forEach(cardButton => {
            if(!elements.includes(cardButton)){
                cardButton.disabled=true;
                uiModule.changeColor(cardButton,'black');
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
    function _isNumber(str){
        return /^\d+$/.test(str);
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
        else if(_isNumber(btnID)){
            if(moveJson.card!=undefined && moveJson.card==='buyletter'){
                moveJson.pos = Number(btnID);
                sendRequest("POST","http://localhost:9000/play",moveJson)
                .then(responseData=>{
                    updateGameInfo(responseData);
                    _alphabetUsage(true);
                    moveJson={};
                })   
                .catch(error=>alert(error));  
            }
        }
        else{
            if(_isLetter(btnID)){
                moveJson.letter = btnID;
                sendRequest("POST","http://localhost:9000/play",moveJson)
                .then(responseData => {
                    updateGameInfo(responseData),
                    responseData.message.isSuccess==="correct" 
                        ? document.getElementById(btnID).className = "correctButton"
                        : document.getElementById(btnID).className = "incorrectButton",
                    document.getElementById(btnID).disabled = true;
                    moveJson={}
                })
                .catch(error=>alert(error));
            }
            else{
                if(moveJson.card!=undefined){
                    uiModule.changeColor(document.getElementById(moveJson.card),'#0D77B7')
                } 
                btnID==='buyletter' ? _alphabetUsage(false) : _alphabetUsage(true);
                moveJson.card = btnID;
                if(btnID==='discount'){
                    _updateAlphabet(configModule.getDiscount(btnID))
                }
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




function buttonAddEvent() {
    document.addEventListener('click',function(event){
        if(event.target.type==='submit'){
            gameInterfaceModule.btnHandler(event.target.id);
        }
    })
    document.getElementById("secretWord").addEventListener('click',function(even){
        if(event.target.textContent.includes('*')){
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