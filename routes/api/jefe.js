var express = require('express');
var router = express.Router();
var Pesona = require('../../models/persona.model');
var bcrypt=require('bcrypt');

router.get('/listar', async(req, res) => { 
    try {
      const listaDb = await Pesona.find({'rol':{ $ne: 'integrante' }, 'estado':true});
      res.json(listaDb);
    } catch (error) {
      return res.status(400).json({
        mensaje: 'Ocurrio un error',
        error
      })
    }
  });

router.post('/nuevo', async(req, res) => {
    const body = req.body;

    if(req.body.fechaNacimiento){
      body.fechaNacimiento = Date.parse(body.fechaNacimiento);
    }
    if(req.body.contrasena){
      body.contrasena=bcrypt.hashSync(body.contrasena,10);
    }

    try {
      const jefeDB = await Pesona.create(body);
      res.status(200).json(jefeDB); 
    } catch (error) {
      return res.status(500).json({
        mensaje: 'Ocurrio un error',
        error
      })
    }
  });

router.get('/listar/:id', async(req, res) => {
    const id = req.params.id;
    try {
      const JefeDB = await Pesona.findOne({id, 'rol':{ $ne: 'integrante' }});
      res.json(JefeDB);
    } catch (error) {
      return res.status(400).json({
        mensaje: 'Ocurrio un error',
        error
      })
    }
  });

router.put('/activar/:id', async(req, res) => {
  const _id = req.params.id;
  try {
    const jefeDB = await Pesona.findByIdAndUpdate(
      _id,
      {estado:true},
      {new: true});
    res.json(jefeDB);  
  } catch (error) {
      return res.status(400).json({
      mensaje: 'Ocurrio un error',
      error
      })
  }
});

router.put('/eliminar/:id', async(req, res) => {
    const _id = req.params.id;
    try {
      const jefeDB = await Pesona.findByIdAndUpdate(
        _id,
        {estado:false},
        {new: true});
      res.json(jefeDB);  
    } catch (error) {
        return res.status(400).json({
        mensaje: 'Ocurrio un error',
        error
        })
    }
});

router.put('/actualizar/:id', async(req, res) => {
    const _id = req.params.id;
    const body = req.body;
    if(req.body.fechaNacimiento){
      body.fechaNacimiento = Date.parse(body.fechaNacimiento);
    }
    if(req.body.contrasena){
      body.contrasena=bcrypt.hashSync(body.contrasena,10);
    }
    try {
      const jefeDB = await Pesona.findByIdAndUpdate(
        _id,
        body,
        {new: true});
      res.json(jefeDB);  
    } catch (error) {
      return res.status(400).json({
        mensaje: 'Ocurrio un error',
        error
      })
    }
  });

  router.get('/inactivos', async(req, res) => {
    try {
      const listaDb = await Pesona.find({'rol':{ $ne: 'integrante' }, 'estado':false});
      res.json(listaDb);
    } catch (error) {
      return res.status(400).json({
        mensaje: 'Ocurrio un error',
        error
      })
    }
  });

module.exports = router;