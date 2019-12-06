global.basedir = __dirname;


const express = require('express');
const app = express();
const ListControllerClass = require('./controller/List');
const ItemControllerClass = require('./controller/Item');


//Swagger set
let swaggerUI = require('swagger-ui-express');
let swaggerDocument = require('./swagger.json');
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));


//Body-parser set
let bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


//List Controller Instance With todoLists.json
let ListController = new ListControllerClass({ 'dbPath' : '/db/todoLists.json'});
let ItemController = new ItemControllerClass({ 'dbPath' : '/db/todoLists.json'});


//ListController assignment to routes.
app
    .get('/lists', ListController.getAll)
    .post('/list', ListController.create)
    .get('/list/:listID', ListController.getOne)
    .put('/list/:listID', ListController.update)
    .delete('/list/:listID', ListController.delete);

//ItemController assignment to routes.
app
    .post('/item/:listID', ItemController.create);
    /*.get('/item/:itemID', ListController.getOne)
    .put('/item/:itemID', ListController.update)
    .delete('/item/:itemID', ListController.delete);*/


//Server start
let server = app.listen(8080, () => {
    console.log('Server is running on 8080 port');
});