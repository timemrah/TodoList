function tools() { let tools = {};




    //Rest api data rule
    tools.api = new function(){

        this.true = function(code = '', msg = '', data = {}) {
            return { status : true, code: code, msg: msg, data: data };
        };

        this.false = function(code = '', msg = '', data = {}) {
            return { status : false, code: code, msg: msg, data: data };
        };

    };




    tools.random = (min, max) => {
        return Math.floor(Math.random() * (max - min) + min );
    };




    tools.reSortObject = (items, itemID, itemNewRow, itemIdName = 'id', itemRowName = 'row') => {

        let selectList = items[itemID];

        //Update row selectList on lists database object
        let oldRow     = selectList.row;
        selectList.row = parseInt(itemNewRow);

        //Check direction of movement
        let dirOfMove = 'up';
        if(oldRow < selectList.row){ dirOfMove = 'down'; }

        //Rebuild row data of lists
        for(let id in items){

            let list = items[id];

            //Not choose selectList
            if(list.id === selectList.id){ continue; }

            if(dirOfMove === 'up'){
                if(list.row >= selectList.row && list.row < oldRow){
                    console.log("id:" + list.id + " row:" + list.row + "->" + (list.row+1));
                    list.row++;
                }
            } else{ //down
                console.log(list.id+": row "+list.row+" -> down");
                if(list.row <= selectList.row && list.row > oldRow){
                    console.log("id:" + list.id + " row:" + list.row + "->" + (list.row-1));
                    list.row--;
                }
            }
        }

        return items;

    };




    return tools;
}




module.exports = new tools();