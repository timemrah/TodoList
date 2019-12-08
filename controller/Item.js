function Item(params){ let Item = {};


    //Dependency
    let fs    = require('fs');
    let tools = require(basedir + '/lib/tools.js');


    //Relative path for database
    Item.dbPath = basedir + params.dbPath;




    Item.create = (req, res) => {

        console.log(req.method + ': ' + req.originalUrl + ' -> Yeni madde ekle');

        let listID = req.params.listID;
        let text = req.body.text || false;

        //Check ID and error answer
        if(!listID){
            res.json(tools.api.false('undefinedListID', 'ID değeri belirtilmemiş'));
            return false;
        }

        //Check title and error answer
        if(!text){
            res.json(tools.api.false('undefinedText', 'madde içeriği belirtilmemiş'));
            return false;
        }

        //Access to todoLists database
        let todoListsDB = require(Item.dbPath);

        //Check the list is there
        if(todoListsDB.lists[listID] === undefined){
            res.json(tools.api.false('undefinedList', 'liste bulunamıyor'));
            return false;
        }
        let selectList = todoListsDB.lists[listID];

        //Create new ID
        let newID = 1;
        if(selectList.lastInsertedItemID){
            newID = parseInt(selectList.lastInsertedItemID) + 1;
        }

        let row = Object.keys(selectList.items).length + 1;

        //Last inserted ID record to the database object
        selectList.lastInsertedItemID = newID.toString();

        //Create new list data
        let newItem = {
            id : newID,
            listID: listID,
            row: row,
            text : text,
            mark: false,
            createAt : Date.now(),
            editAt : null,
        };

        //New item add to the list on the database object
        selectList.items[newID] = newItem;

        //Create JSON string for database with list database object.
        let listsJsonString = JSON.stringify(todoListsDB);

        //New string of JSON write to the database
        fs.writeFile(Item.dbPath, listsJsonString, err => {

            //Check Err and error answer
            if(err){
                res.json(tools.api.false('dbWriteError', 'veritabanına kayıt başarısız', err));
                return false;
            }

            //Success Answer
            res.json(tools.api.true('success', 'madde eklendi', newItem));
        });
    };




    Item.getOne = (req, res) => {

        console.log(req.method + ': ' + req.originalUrl + ' -> Bir madde göster');

        let listID = req.params.listID || false;
        let itemID = req.params.itemID || false;

        //Check ID and error answer
        if(!listID){
            res.json(tools.api.false('undefinedListID', 'liste ID değeri belirtilmemiş'));
            return false;
        }
        if(!itemID){
            res.json(tools.api.false('undefinedItemID', 'madde ID değeri belirtilmemiş'));
            return false;
        }

        //Access to todoLists database
        let todoListsDB = require(Item.dbPath);

        //Check listID in the database and error answer
        if(todoListsDB.lists[listID] === undefined){
            res.json(tools.api.false('listNotFound', 'liste bulunamadı'));
            return false;
        }
        let selectList = todoListsDB.lists[listID];

        if(selectList.items[itemID] === undefined){
            res.json(tools.api.false('itemNotFound', 'madde bulunamadı'));
            return false;
        }
        let selectItem = selectList.items[itemID];

        //Success answer
        res.json(tools.api.true('success', 'liste bulundu', selectItem));

    };




    Item.update = (req, res) => {

        console.log(req.method + ': ' + req.originalUrl + ' -> Madde güncelle');

        let listID = req.params.listID || false;
        let itemID = req.params.itemID || false;
        let text   = req.body.text || false;

        //Check ID and error answer
        if(!listID){
            res.json(tools.api.false('undefinedListID', 'liste ID değeri belirtilmemiş'));
            return false;
        }
        if(!itemID){
            res.json(tools.api.false('undefinedItemID', 'madde ID değeri belirtilmemiş'));
            return false;
        }

        //Check title and error answer
        if(!text){
            res.json(tools.api.false('undefinedTitle', 'madde içeriği boş'));
            return false;
        }

        //Access to todoLists database
        let todoListsDB = require(Item.dbPath);

        //Check listID in the database and error answer
        if(todoListsDB.lists[listID] === undefined){
            res.json(tools.api.false('listNotFound', 'liste bulunamadı'));
            return false;
        }
        let selectList = todoListsDB.lists[listID];

        if(selectList.items[itemID] === undefined){
            res.json(tools.api.false('itemNotFound', 'madde bulunamadı'));
            return false;
        }
        let selectItem = selectList.items[itemID];

        //Select list and update
        selectItem.text  = text;
        selectItem.editAt = Date.now();

        //Create JSON string for database with lists database object.
        let listsJsonString = JSON.stringify(todoListsDB);

        //New string of JSON write to the database
        fs.writeFile(Item.dbPath, listsJsonString,err => {

            //Check Err and error answer
            if(err){
                res.json(tools.api.false('dbWriteError', 'veritabanına kayıt başarısız', err));
                return false;
            }

            //Success Answer
            res.json(tools.api.true('success', 'madde güncellendi', selectItem));
        });

    };




    Item.sort = (req, res) => {

        console.log(req.method + ': ' + req.originalUrl + ' -> Madde sırala');

        let listID  = req.params.listID || false;
        let itemID = req.params.itemID || false;
        let itemNewRow = req.body.row || false;

        //Check request data and error answer
        if(!listID){
            res.json(tools.api.false('undefinedListListID', 'iist ID belirtilmemiş'));
            return false;
        }
        if(!itemID){
            res.json(tools.api.false('undefinedListItemID', 'item ID belirtilmemiş'));
            return false;
        }
        if(!itemNewRow){
            res.json(tools.api.false('undefinedRow', 'row belirtilmemiş'));
            return false;
        }

        //Access to todoLists database
        let todoListsDB = require(Item.dbPath);

        //Check listID in the database and error answer
        if(todoListsDB.lists[listID] === undefined){
            res.json(tools.api.false('notFound', 'liste bulunamadı'));
            return false;
        }
        let selectList = todoListsDB.lists[listID];

        if(selectList.items[itemID] === undefined){
            res.json(tools.api.false('itemNotFound', 'madde bulunamadı'));
            return false;
        }

        //Row process
        tools.reSortObject(selectList.items, itemID, itemNewRow, 'id', 'row');

        //Create JSON string for database with lists database object.
        let listsJsonString = JSON.stringify(todoListsDB);

        //New string of JSON write to the database
        fs.writeFile(Item.dbPath, listsJsonString,err => {

            //Check Err and error answer
            if(err){
                res.json(tools.api.false('dbWriteError', 'veritabanına kayıt başarısız', err));
                return false;
            }

            //Success Answer
            res.json( tools.api.true('success', 'liste sırası güncellendi'));
        });


    };




    Item.delete = (req, res) => {

        console.log(req.method + ': ' + req.originalUrl + ' -> Liste sil');

        let listID  = req.params.listID || false;
        let itemID = req.params.itemID || false;

        //Check request data and error answer
        if(!listID){
            res.json(tools.api.false('undefinedListID', 'list ID belirtilmemiş'));
            return false;
        }
        if(!itemID){
            res.json(tools.api.false('undefinedItemID', 'item ID belirtilmemiş'));
            return false;
        }

        //Access to todoLists database
        let todoListsDB = require(Item.dbPath);

        //Check listID in the database and error answer
        if(todoListsDB.lists[listID] === undefined){
            res.json(tools.api.false('notFound', 'liste bulunamadı'));
            return false;
        }
        let selectList = todoListsDB.lists[listID];

        if(selectList.items[itemID] === undefined){
            res.json(tools.api.false('itemNotFound', 'madde bulunamadı'));
            return false;
        }
        let selectItem = selectList.items[itemID];


        //Delete list data on the lists database object
        let deleteItem = selectItem;
        delete selectList.items[itemID];

        //Record deleted ID to database object and deletedItemsID sort asc
        selectList.deletedItemsID.push(parseInt(itemID));
        selectList.deletedItemsID.sort((a, b) => a - b);

        //Rebuild row data of lists
        for(let id in selectList.items){
            let item = selectList.items[id];
            if(item.row > deleteItem.row){
                console.log("itemID:" + id + ' row:' + item.row + "->" + (item.row-1));
                item.row--;
            }
        }

        //Create JSON string for database with lists database object.
        let listsJsonString = JSON.stringify(todoListsDB);

        //New string of JSON write to the database
        fs.writeFile(Item.dbPath, listsJsonString,err => {

            //Check Err and error answer
            if(err){
                res.json(tools.api.false('dbWriteError', 'veritabanına kayıt başarısız', err));
                return false;
            }

            //Success Answer
            res.json( tools.api.true('success', 'madde silindi', deleteItem));
        });
    };




    Item.mark = (req, res) => {
        console.log(req.method + ': ' + req.originalUrl + ' -> Madde isaretle');

        let listID  = req.params.listID || false;
        let itemID = req.params.itemID || false;
        let mark   = req.body.mark || null;

        let str2Bool = {
            "true": true,
            "false": false
        };

        //Check request data and error answer
        if(!listID){
            res.json(tools.api.false('undefinedListID', 'list ID belirtilmemiş'));
            return false;
        }
        if(!itemID){
            res.json(tools.api.false('undefinedItemID', 'item ID belirtilmemiş'));
            return false;
        }
        if(mark === null){
            res.json(tools.api.false('undefinedMark', 'mark belirtilmemiş'));
            return false;
        }

        //Access to todoLists database
        let todoListsDB = require(Item.dbPath);

        //Check listID in the database and error answer
        if(todoListsDB.lists[listID] === undefined){
            res.json(tools.api.false('notFound', 'liste bulunamadı'));
            return false;
        }
        let selectList = todoListsDB.lists[listID];

        if(selectList.items[itemID] === undefined){
            res.json(tools.api.false('itemNotFound', 'madde bulunamadı'));
            return false;
        }
        let selectItem = selectList.items[itemID];
        selectItem.mark = str2Bool[mark];

        //Create JSON string for database with lists database object.
        let listsJsonString = JSON.stringify(todoListsDB);

        //JSON write to the database
        fs.writeFile(Item.dbPath, listsJsonString,err => {
            //Check Err and error answer
            if(err){
                res.json(tools.api.false('dbWriteError', 'veritabanına kayıt başarısız', err));
                return false;
            }
            //Success Answer
            res.json( tools.api.true('success', 'madde silindi', {mark : mark}));
        });


    };




    return Item;
}




module.exports = Item;