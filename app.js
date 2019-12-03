let express = require('express');
let fs = require('fs');
let tools = require('./lib/tools');

let app = express();
let todoListDBPath = './db/todoLists.json';




//GET ALL LIST AND ITEMS
app.get('/lists', (req, res) => {

    let lists = require(todoListDBPath);
    res.json(lists);

});




//GET LIST
app.get('/list', (request, response) => {

    fs.readFile(todoListDBPath, 'utf8',(err, data) => {
        response.end(data);
    });

});




//ADD LIST
app.post('/add-list', (req, res) => {

    //Check title and error answer
    if(!req.query.title.length){
        res.json({
            "status" : false,
            "statusCode" : "undefinedTitle",
            "msg" : "Liste adı belirtilmemiş!",
            "data" : null
        });
        return false;
    }

    //Access to todolists database
    let todoListsDB = require(todoListDBPath);

    //Create new ID
    let newID = parseInt(todoListsDB.lastInsertedListID) + 1;

    //Last inserted ID record to database object
    todoListsDB.lastInsertedListID = newID.toString();

    //New list add to the database object
    todoListsDB.lists[newID] = {
        "title" : "New List " + newID,
        "createAt" : Date.now(),
        "lastInsertedItemID" : null,
        "deletedItemsID" : [],
        "items" : {}
    };

    //Create database object JSON string.
    let listsJsonString = JSON.stringify(todoListsDB);

    //New string of JSON write to the database
    fs.writeFile(todoListDBPath, listsJsonString,err => {

        //Check Err and error answer
        if(err){
            res.json({
                "status" : false,
                "statusCode" : "dbWriteError",
                "msg" : "Veritabanına yazma işlemi başarısız oldu!",
                "data" : err
            });
            return false;
        }

        //Success Answer
        res.json({
            "status" : true,
            "statusCode" : "success",
            "msg" : "Veritabanına kayıt başarıyla gerçekleşti!",
            "data" : null
        });
    });

});




//DELETE LIST
app.get('/delete-list', (request, response) => {

    let listID = 2;

    if(!listID){
        res.json({
            "status" : false,
            "statusCode" : "undefinedListID",
            "msg" : "Silmek istenen listenin ID değeri belirtilmemiş!",
            "data" : null
        });
        return false;
    }

    response.end('Remove list');

});




//EDIT LIST
app.post('/edit-list', (request, response) => {

    response.end('Update list');

});







//START SERVER
let server = app.listen(8000, () => {

    console.log('Sunucu çalıştı');

});