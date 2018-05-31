var express = require('express');
var app = express();
var MongoClient = require('mongodb').MongoClient,
    co = require('co'),
    assert = require('assert');

app.set('views', './views');
app.set('view engine', 'pug');
 
function insertarDB(nomb,temp,año) {
    co( function* (){
        var db = yield MongoClient.connect('mongodb://localhost:27017/animeDB');
        console.log("Wena");
        var r = yield db.collection('coleccion_anime').insertOne({nombre: nomb, temporada: temp, anio: año});
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
                res.send('Te encontré >:D ' + doc.nombre +' '+ doc.temporada+' '+ doc.anio);
                console.log(doc);
            }
            else{
                res.send("Nel perro");
            }
        })
        db.close()
    })
}

function modificarBD(nomb,newNom,res) {
    co( function* () {
        var db = yield MongoClient.connect('mongodb://localhost:27017/animeDB');
        console.log("Wena");
        var col = db.collection('coleccion_anime');
        col.updateOne({nombre: nomb},{
            $set: {nombre : newNom}}).then(function(result){
                res.send("Modificado :)");
            })
        db.close()
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
        db.close()
    })
}

function obtenerDocumentos(res) {
    co( function* () {
        var db = yield MongoClient.connect('mongodb://localhost:27017/animeDB');
        var col = db.collection('coleccion_anime');
        var doc = yield col.find({}).toArray();
        console.log(doc);
    });
}
app.get('/', function (req, res) {
    co( function* () {
        var db = yield MongoClient.connect('mongodb://localhost:27017/animeDB');
        var col = db.collection('coleccion_anime');
        var doc = yield col.find({}).toArray();
        res.render('index', { titulo: 'Documentos', listaSeries: doc});
    });
});

app.get('/crear/:nombre/:temporada/:anio', function (req, res) {
    insertarDB(req.params.nombre,req.params.temporada,req.params.anio);
        res.send('Documento Creado');
});

app.get('/leer/:nombre/', function(req, res) {
    leerBD(req.params.nombre,res);
});

app.get('/modificar/:nombre/:nuevoNombre',function(req,res){
    modificarBD(req.params.nombre,req.params.nuevoNombre,res);
})
app.get('/eliminar/:nombre',function(req,res) {
    eliminarBD(req.params.nombre,res);
})
app.listen(3000, function () {
    console.log('Listening on http://localhost:3000');
});