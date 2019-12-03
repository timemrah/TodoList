class tools {

    constructor() {

    }

    random(min, max){
        return Math.floor(Math.random() * (max - min) + min );
    }

}


module.exports = new tools();