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

        let listTitle = req.body.title || false;
        //let listTitle = "Yeni Liste";

        //Check title and error answer
        if(!listTitle){
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

        //Last inserted ID record to database object
        todoListsDB.lastInsertedListID = newID.toString();

        //Create new list data
        let newList = {
            id : newID,
            title : listTitle,
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
        let todoListsDB = require(List.dbPath);

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
        todoListsDB.deletedListsID.push(parseInt(listID));

        //deletedListID order by asc for database record
        todoListsDB.deletedListsID.sort((a, b) => a - b);

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