var express = require('express');
var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Medico = require('../models/medico');

// ================================
// Obtener todos los Médicos
// ================================
app.get('/', (req, res) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Medico.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('hospital')
        .exec(
            (err, medicos) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        message: 'Error cargando Médicos',
                        errors: err
                    });
                }

                Medico.countDocuments({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        medicos: medicos,
                        total: conteo
                    });
                });
            }
        );

});

// ================================
// Actualizar Médicos
// ================================

app.put('/:id', mdAutenticacion.vertificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Medico.findById(id, (err, medico) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al buscar Médicos'
            });
        }

        if (!medico) {
            return res.status(400).json({
                ok: false,
                message: 'El Médicos con el id ' + id + ' no existe',
                errors: { message: 'No existe el Médicos con ese ID' }
            });
        }

        medico.nombre = body.nombre;
        medico.usuario = req.usuario._id;
        medico.hospital = body.hospital;

        medico.save((err, medicoGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: 'Error al actualizar Médicos',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                medico: medicoGuardado
            });
        });
    });
});

// ================================
// Crear un nuevo Médicos
// ================================
app.post('/', mdAutenticacion.vertificaToken, (req, res) => {

    var body = req.body;

    var medico = new Medico({
        nombre: body.nombre,
        usuario: req.usuario._id,
        hospital: body.hospital
    });

    medico.save((err, medicoGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: 'Error al crear medico',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            medico: medicoGuardado
        });
    });
});

// ================================
// Borrar usuario por id
// ================================

app.delete('/:id', mdAutenticacion.vertificaToken, (req, res) => {

    var id = req.params.id;

    Medico.findByIdAndRemove(id, (err, medicoBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al borrar médico',
                errors: err
            });
        }

        if (!medicoBorrado) {
            return res.status(400).json({
                ok: false,
                message: 'No existe médico con el id ' + id,
                errors: { message: 'No existe médico con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            medico: medicoBorrado
        });
    });
});


module.exports = app;