// Requires
var express = require('express');
var mongoonse = require('mongoose');
var bodyParser = require('body-parser');


// Iniciar variables
var app = express();


// Body Parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Importar rutas
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');

// Conexión a la base de datos
mongoonse.connection.openUri('mongodb://localhost:27017/hospitalDB', { useCreateIndex: true, useNewUrlParser: true }, (err, res) => {
    if (err) throw err;

    console.log('Base de datos:\x1b[32m%s\x1b[0m', ' Online');
});


// Rutas
app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/', appRoutes);



// Escuchar peticiones
app.listen(3000, () => {
    console.log('Express server en el puerto 3000:\x1b[32m%s\x1b[0m', ' Online');
});