function tools() {

    let tools = {};


    //API ANSWER CLASS
    tools.api = new function(){

        this.true = function(code = '', msg = '', data = {}) {
            return { status : true, code: code, msg: msg, data: data };
        };

        this.false = function(code = '', msg = '', data = {}) {
            return { status : false, code: code, msg: msg, data: data };
        };

    };


    //RANDOM METHOD
    tools.random = (min, max) => {
        return Math.floor(Math.random() * (max - min) + min );
    };


    return tools;
}


module.exports = new tools();