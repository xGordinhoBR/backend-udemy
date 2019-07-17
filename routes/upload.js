var express = require('express');

var fileUpload = require('express-fileupload');
var fs = require('fs');


var app = express();

var Usuario = require('../models/usuario');
var Medico = require('../models/medico');
var Hospital = require('../models/hospital');

// default options
app.use(fileUpload());

app.put('/:tipo/:id', (req, res) => {

    var tipo = req.params.tipo;
    var id = req.params.id;

    // Tipos de colección
    var tiposValidos = ['hospitales', 'medicos', 'usuarios'];

    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            message: 'Tipo de coleccion no es válida',
            errors: { message: 'Las colecciones válidas son: ' + tiposValidos.join(', ') }
        });
    }

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            message: 'No hay imagen',
            errors: { message: 'Debes seleccionar una imgen ' }
        });

    }

    // Obtener nombre archivo
    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extensionArchivo = nombreCortado[nombreCortado.length - 1];

    // Solo estas extensiones aceptamos
    var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesValidas.indexOf(extensionArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            message: 'Extensión no válida',
            errors: { message: 'Las extensiones válidas son: ' + extensionesValidas.join(', ') }
        });
    }

    // Nombre archivo personalizado
    var nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extensionArchivo }`;

    // Mover archivo del temporal a un path
    var path = `./uploads/${ tipo }/${ nombreArchivo }`;

    archivo.mv(path, err => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover archivo',
                errors: err
            });
        }

        subirPorTipo(tipo, id, nombreArchivo, res);
    });
});


function subirPorTipo(tipo, id, nombreArchivo, res) {

    if (tipo === 'usuarios') {



        Usuario.findById(id, (err, usuario) => {

            if (!usuario) {
                return res.status(400).json({
                    ok: false,
                    message: 'Usuario no existe',
                    errors: { message: 'Usuario no existe' }
                });
            }

            var pathViejo = './uploads/usuarios/' + usuario.img;

            // Si existe la imagen, la elimina.
            if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo);
            }

            usuario.img = nombreArchivo;

            usuario.save((err, usuarioActualizado) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        message: 'Imagen no guardada',
                        errors: { message: 'Imagen no guardada' }
                    });

                }

                usuarioActualizado.password = '';

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de usuario actualizada',
                    usuario: usuarioActualizado
                });
            });

        });
    }

    if (tipo === 'medicos') {

        Medico.findById(id, (err, medico) => {

            if (!medico) {
                return res.status(400).json({
                    ok: false,
                    message: 'medico no existe',
                    errors: { message: 'medico no existe' }
                });
            }

            var pathViejo = './uploads/medicos/' + medico.img;

            // Si existe la imagen, la elimina.
            if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo);
            }

            medico.img = nombreArchivo;

            medico.save((err, medicoActualizado) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        message: 'Imagen no guardada',
                        errors: { message: 'Imagen no guardada' }
                    });

                }

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de medico actualizada',
                    medico: medicoActualizado
                });
            });

        });
    }

    if (tipo === 'hospitales') {
        Hospital.findById(id, (err, hospital) => {

            if (!hospital) {
                return res.status(400).json({
                    ok: false,
                    message: 'Hospital no existe',
                    errors: { message: 'Hospital no existe' }
                });
            }

            var pathViejo = './uploads/hospitales/' + hospital.img;

            // Si existe la imagen, la elimina.
            if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo);
            }

            hospital.img = nombreArchivo;

            hospital.save((err, hospitalActualizado) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        message: 'Imagen no guardada',
                        errors: { message: 'Imagen no guardada' }
                    });

                }

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de hospital actualizada',
                    hospital: hospitalActualizado
                });
            });

        });
    }


}

module.exports = app;