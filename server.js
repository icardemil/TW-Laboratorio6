var express = require('express');
var app = express();
var documento;

var MongoClient = require('mongodb').MongoClient,
    co = require('co'),
    assert = require('assert');

app.set('views', './views');
app.set('view engine', 'pug');
 
function insertarDB(nomb,temp) {
    co( function* (){
        var db = yield MongoClient.connect('mongodb://localhost:27017/animeDB');
        console.log("Wena");
        var r = yield db.collection('coleccion_anime').insertOne({nombre: nomb, temporada: temp});
        assert.equal(1, r.insertedCount);
        db.close();
    }).catch(function (err){
        console.log(err.stack);
    });
}

function leerBD(nomb,res) {
    co( function* () {
        var db = yield MongoClient.connect('mongodb://localhost:27017/animeDB');
        console.log("Wena");
        var col = db.collection('coleccion_anime');
        col.findOne({nombre: nomb}, function (err,doc) {
            if(doc){
                res.send('Te encontré >:D ' + doc.nombre);
                console.log(doc);
            }
            else{
                res.send("Nel perro");
            }
        })
    })
}

function modificarBD(nomb,newTemp,res) {
    co( function* () {
        var db = yield MongoClient.connect('mongodb://localhost:27017/animeDB');
        console.log("Wena");
        var col = db.collection('coleccion_anime');
        col.updateOne({nombre: nomb},{
            $set: {temporada : newTemp}}).then(function(result){
                res.send("Modificado :)");
            })
    })  
}

function eliminarBD(nomb,res) {
    co( function* (){
        var db = yield MongoClient.connect('mongodb://localhost:27017/animeDB');
        console.log("Wena");
        var col = db.collection('coleccion_anime');
        col.deleteOne({nombre: nomb}).then(function(result) {
            res.send("Eliminado :(");
        })
    })
}
app.get('/', function (req, res) {
    res.render('index', { title: 'Hey', message: 'Hello there!' });
});

app.get('/crear', function (req, res) {
    insertarDB('Steins;Gate','Primavera 2018');
    insertarDB('Sword Art Online','Otoño 2018');    
    res.send('Documento Creado');
});

app.get('/leer', function(req, res) {
    leerBD("Steins;Gate",res);
});

app.get('/modificar',function(req,res){
    modificarBD("Steins;Gate","Invierno 2014",res);
})
app.get('/eliminar',function(req,res) {
    eliminarBD("Sword Art Online",res);
})
app.listen(3000, function () {
    console.log('Listening on http://localhost:3000');
});