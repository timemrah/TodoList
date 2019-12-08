function List(params){ let List = {};


    //Dependency
    let fs    = require('fs');
    let tools = require(basedir + '/lib/tools.js');


    //Relative path for database
    List.dbPath = basedir + params.dbPath;




    List.getAll = (req, res) => {

        console.log(req.method + ': ' + req.originalUrl + ' -> Tüm listeleri göster');

        let listsDB = require(List.dbPath);
        res.json(tools.api.true('success', 'listeleme yapılıyor', listsDB.lists));
    };




    List.create = (req, res) => {

        console.log(req.method + ': ' + req.originalUrl + ' -> Yeni liste ekle');

        let title       = req.body.title || false;
        let description = req.body.description || false;

        //Check title and error answer
        if(!title){
            res.json(tools.api.false('undefinedTitle', 'liste adı belirtilmemiş!'));
            return false;
        }

        //Access to todoLists database
        let todoListsDB = require(List.dbPath);

        //Create new ID
        let newID = 1;
        if(todoListsDB.lastInsertedListID){
            newID = parseInt(todoListsDB.lastInsertedListID) + 1;
        }

        let row = Object.keys(todoListsDB.lists).length + 1;

        //Last inserted ID record to database object
        todoListsDB.lastInsertedListID = newID.toString();

        //Create new list data
        let newList = {
            id : newID,
            row : row,
            title : title,
            description : description,
            createAt : Date.now(),
            editAt : null,
            lastInsertedItemID : null,
            deletedItemsID : [],
            items : {}
        };

        //New list add to the database object
        todoListsDB.lists[newID] = newList;

        //Create JSON string for database with list database object.
        let listsJsonString = JSON.stringify(todoListsDB);

        //New string of JSON write to the database
        fs.writeFile(List.dbPath, listsJsonString, err => {

            //Check Err and error answer
            if(err){
                res.json(tools.api.false('dbWriteError', 'veritabanına kayıt başarısız', err));
                return false;
            }

            //Success Answer
            res.json(tools.api.true('success', 'liste eklendi', newList));
        });
    };




    List.getOne = (req, res) => {

        console.log(req.method + ': ' + req.originalUrl + ' -> Bir liste göster');

        let listID = req.params.listID || false;

        //Check ID and error answer
        if(!listID){
            res.json(tools.api.false('undefinedListID', 'ID değeri belirtilmemiş'));
            return false;
        }

        //Access to todoLists database
        let todoListsDB = require(List.dbPath);

        //Check listID in the database and error answer
        if(todoListsDB.lists[listID] === undefined){
            res.json(tools.api.false('notFound', 'liste bulunamadı'));
            return false;
        }

        //Success answer
        let selectList = todoListsDB.lists[listID];
        res.json(tools.api.true('success', 'liste bulundu', selectList));

    };




    List.update = (req, res) => {

        console.log(req.method + ': ' + req.originalUrl + ' -> Liste güncelle');

        let listID      = req.params.listID || false;
        let title       = req.body.title || false;
        let description = req.body.description || false;


        //Check ID and error answer
        if(!listID){
            res.json(tools.api.false('undefinedListID', 'ID belirtilmemiş'));
            return false;
        }

        //Check title and error answer
        if(!title){
            res.json(tools.api.false('undefinedTitle', 'liste adı belirtilmemiş'));
            return false;
        }

        //Access to todoLists database
        let todoListsDB = require(List.dbPath);

        //Check listID in the database and error answer
        if(todoListsDB.lists[listID] === undefined){
            res.json(tools.api.false('notFound', 'liste bulunamadı'));
            return false;
        }

        //Select list and update
        let selectedList    = todoListsDB.lists[listID];
        selectedList.title  = title;
        if(description){ //Update the description if there is.
            selectedList.description  = description;
        }
        selectedList.editAt = Date.now();

        //Create JSON string for database with lists database object.
        let listsJsonString = JSON.stringify(todoListsDB);

        //New string of JSON write to the database
        fs.writeFile(List.dbPath, listsJsonString,err => {

            //Check Err and error answer
            if(err){
                res.json(tools.api.false('dbWriteError', 'veritabanına kayıt başarısız', err));
                return false;
            }

            //Success Answer
            res.json(tools.api.true('success', 'liste güncellendi', selectedList));
        });

    };




    List.sort = (req, res) => {

        console.log(req.method + ': ' + req.originalUrl + ' -> Liste sırala');

        let listID  = req.params.listID || false;
        let listNewRow = req.body.row || false;

        //Check request data and error answer
        if(!listID){
            res.json(tools.api.false('undefinedListID', 'ID belirtilmemiş'));
            return false;
        }
        if(!listNewRow){
            res.json(tools.api.false('undefinedRow', 'row belirtilmemiş'));
            return false;
        }

        //Access to todoLists database
        let todoListsDB = require(List.dbPath);

        //Check listID in the database and error answer
        if(todoListsDB.lists[listID] === undefined){
            res.json(tools.api.false('notFound', 'liste bulunamadı'));
            return false;
        }


        //Row process
        tools.reSortObject(todoListsDB.lists, listID, listNewRow, 'id', 'row');


        //Create JSON string for database with lists database object.
        let listsJsonString = JSON.stringify(todoListsDB);

        //New string of JSON write to the database
        fs.writeFile(List.dbPath, listsJsonString,err => {

            //Check Err and error answer
            if(err){
                res.json(tools.api.false('dbWriteError', 'veritabanına kayıt başarısız', err));
                return false;
            }

            //Success Answer
            res.json( tools.api.true('success', 'liste sırası güncellendi'));
        });


    };




    List.delete = (req, res) => {

        console.log(req.method + ': ' + req.originalUrl + ' -> Liste sil');

        let listID = req.params.listID || false;

        //Check ID and error answer
        if(!listID){
            res.json(tools.api.false('undefinedListID', 'ID değeri belirtilmemiş!'));
            return false;
        }

        //Access to todoLists database
        let todoListsDB = require(List.dbPath);

        //Check listID in the database and error answer
        if(todoListsDB.lists[listID] === undefined){
            res.json(tools.api.false('notFound', 'liste bulunamadı'));
            return false;
        }

        //Delete list data on the lists database object
        let deleteList = todoListsDB.lists[listID];
        delete todoListsDB.lists[listID];

        //Record deleted ID to database object
        todoListsDB.allowListsID.push(parseInt(listID));

        //deletedListID order by asc for database record
        todoListsDB.allowListsID.sort((a, b) => a - b);

        //Rebuild row data of lists
        for(let id in todoListsDB.lists){
            let list = todoListsDB.lists[id];
            if(list.row > deleteList.row){
                console.log("listID:" + id + ': list.row --' + (list.row-1));
                list.row--;
            }
        }

        //Create JSON string for database with lists database object.
        let listsJsonString = JSON.stringify(todoListsDB);

        //New string of JSON write to the database
        fs.writeFile(List.dbPath, listsJsonString,err => {

            //Check Err and error answer
            if(err){
                res.json(tools.api.false('dbWriteError', 'veritabanına kayıt başarısız', err));
                return false;
            }

            //Success Answer
            res.json( tools.api.true('success', 'liste silindi', deleteList));
        });
    };




    return List;
}




module.exports = List;