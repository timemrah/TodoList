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
            res.json(tools.api.false('undefinedText', 'Madde içeriği belirtilmemiş'));
            return false;
        }

        //Access to todoLists database
        let todoListsDB = require(Item.dbPath);

        if(todoListsDB.lists[listID] === undefined){
            res.json(tools.api.false('undefinedList', 'Liste bulunamıyor'));
            return false;
        }

        let selectList = todoListsDB.lists[listID];

        //Create new ID
        let newID = 1;
        if(selectList.lastInsertedItemID){
            newID = parseInt(selectList.lastInsertedItemID) + 1;
        }

        //Last inserted ID record to the database object
        selectList.lastInsertedItemID = newID.toString();

        //Create new list data
        let newItem = {
            id : newID,
            listID: listID,
            row: newID,
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




    /*Item.getOne = (req, res) => {

        console.log(req.method + ': ' + req.originalUrl + ' -> Bir liste göster');

        let listID = req.params.listID || false;

        //Check ID and error answer
        if(!listID){
            res.json(tools.api.false('undefinedListID', 'ID değeri belirtilmemiş'));
            return false;
        }

        //Access to todoLists database
        let todoListsDB = require(Item.dbPath);

        //Check listID in the database and error answer
        if(todoListsDB.lists[listID] === undefined){
            res.json(tools.api.false('notFound', 'liste bulunamadı'));
            return false;
        }

        //Success answer
        let selectList = todoListsDB.lists[listID];
        res.json(tools.api.true('success', 'liste bulundu', selectList));

    };




    Item.update = (req, res) => {

        console.log(req.method + ': ' + req.originalUrl + ' -> Liste güncelle');

        let listID = req.params.listID || false;
        //let title = req.query.title || false;

        let listTitle = req.body.title;

        //Check ID and error answer
        if(!listID){
            res.json(tools.api.false('undefinedListID', 'ID değeri belirtilmemiş'));
            return false;
        }

        //Check title and error answer
        if(!listTitle){
            res.json(tools.api.false('undefinedTitle', 'liste adı belirtilmemiş'));
            return false;
        }

        //Access to todoLists database
        let todoListsDB = require(Item.dbPath);

        //Check listID in the database and error answer
        if(todoListsDB.lists[listID] === undefined){
            res.json(tools.api.false('notFound', 'liste bulunamadı'));
            return false;
        }

        let selectedList    = todoListsDB.lists[listID];
        selectedList.title  = listTitle;
        selectedList.editAt = Date.now();

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
            res.json(tools.api.true('success', 'liste güncellendi', selectedList));
        });

    };




    Item.delete = (req, res) => {

        console.log(req.method + ': ' + req.originalUrl + ' -> Liste sil');

        let listID = req.params.listID || false;

        //Check ID and error answer
        if(!listID){
            res.json(tools.api.false('undefinedListID', 'ID değeri belirtilmemiş!'));
            return false;
        }

        //Access to todoLists database
        let todoListsDB = require(Item.dbPath);

        //Check listID in the database and error answer
        if(todoListsDB.lists[listID] === undefined){
            res.json(tools.api.false('notFound', 'liste bulunamadı'));
            return false;
        }

        //Delete list data on the lists database object
        let deleteList = todoListsDB.lists[listID];
        delete todoListsDB.lists[listID];

        //Record deleted ID to database object
        todoListsDB.deletedListsID.push(parseInt(listID));

        //deletedListID order by asc for database record
        todoListsDB.deletedListsID.sort((a, b) => a - b);

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
            res.json( tools.api.true('success', 'liste silindi', deleteList));
        });
    };*/




    return Item;
}




module.exports = Item;