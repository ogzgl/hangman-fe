const myModule = (function(){
    function _gizlibu(s){
        return s;
    }
    function deneme(s){
        return _gizlibu(s);
    }
    return {
        deneme
    }
}());

let selam = myModule.deneme("wqeqwewe");
console.log(selam)

