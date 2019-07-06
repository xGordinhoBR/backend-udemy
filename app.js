// Requires
var express = require('express');
var mongoonse = require('mongoose');


// Iniciar variables
var app = express();

// Conexión a la base de datos
mongoonse.connection.openUri('mongodb://localhost:27017/hospitalDB', { useNewUrlParser: true }, (err, res) => {
    if (err) throw err;

    console.log('Base de datos:\x1b[32m%s\x1b[0m', ' Online');
});


// Rutas
app.get('/', (req, res, next) => {
    res.status(200).json({ ok: true, message: 'Todo perfecto' });
});

// Escuchar peticiones
app.listen(3000, () => {
    console.log('Express server en el puerto 3000:\x1b[32m%s\x1b[0m', ' Online');
});