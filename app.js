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
let bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


//List Controller Instance With todoLists.json
let ListController = new ListControllerClass({ 'dbPath' : '/db/todoLists.json'});
let ItemController = new ItemControllerClass({ 'dbPath' : '/db/todoLists.json'});


//STATIC Routes For HTML
app.use(express.static('view'));
app.use('/public', express.static('public'));
app.use('/bootstrap', express.static('node_modules/bootstrap'));
app.use('/fontawesome', express.static('node_modules/@fortawesome'));



//REST API ROUTS
//ListController assignment to routes.
app
    .get('/lists', ListController.getAll)
    .post('/list', ListController.create)
    .get('/list/:listID', ListController.getOne)
    .put('/list/:listID', ListController.update)
    .put('/list/:listID/sort', ListController.sort)
    .delete('/list/:listID', ListController.delete);

//ItemController assignment to routes.
app
    .post('/item/:listID', ItemController.create)
    .get('/item/:listID/:itemID', ItemController.getOne)
    .put('/item/:listID/:itemID', ItemController.update)
    .delete('/item/:listID/:itemID', ItemController.delete)
    .put('/item/:listID/:itemID/sort', ItemController.sort)
    .put('/item/:listID/:itemID/mark', ItemController.mark);
//REST API ROUTS//


//Server start
let server = app.listen(80, () => {
    console.log('Nodejs server is running for todolist project');
});