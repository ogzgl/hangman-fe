const configModule = function() {
    let alphabetConf = {}
    let cardsConf = {}  

    function setAlphabet(alph){
        alphabetConf = alph;
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
}();



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

sendRequest("GET","http://localhost:9000")
.then(responseData =>
    {
        configModule.setAlphabet(responseData.alphabetCost);
        configModule.addCard(responseData);
    })
.catch(
    error => console.log(error)
)

