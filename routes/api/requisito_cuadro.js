var express = require('express');
var router = express.Router();
var Requisito = require('../../models/requisito.model');
var Cuadro_adelanto = require('../../models/cuadro.model');

router.get('/',(req,res,next)=>{
    console.log("funciona");
});

router.post('/nuevo/:id', async(req, res) => {
    const _id = req.params.id;
    const body = req.body;

    try {
        var cuadroDB = await Cuadro_adelanto.findOne({_id});
        var requisitoDB = await Requisito.create(body);
        cuadroDB.requisitos.push(requisitoDB._id);
        await Cuadro_adelanto.findByIdAndUpdate(
            _id,
            cuadroDB,
            {new: true});
        res.json(requisitoDB); 
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
    try {
        const requisitoDB = await Requisito.findByIdAndUpdate(
        _id,
        body,
        {new: true});
        res.json(requisitoDB);  
    } catch (error) {
        return res.status(400).json({
        mensaje: 'Ocurrio un error',
        error
        })
    }
});

router.delete('/eliminar/:idrequisito/:idcuadro', async(req, res) => {
    const idrequisito = req.params.idrequisito;
    const idcuadro = req.params.idcuadro;

    try {
        const requisitoDB = await Requisito.findByIdAndDelete({_id:idrequisito});
        if(!requisitoDB){
            return res.status(400).json({
                mensaje: 'No se encontró el id indicado',
                error
            })
        }
        var cuadroDB = await Cuadro_adelanto.findOne({_id:idcuadro});
        var requisitos = cuadroDB.requisitos.filter(x => {
            return x != idrequisito;
        });
        cuadroDB.requisitos=requisitos;
        await Cuadro_adelanto.findByIdAndUpdate(
            {_id : idcuadro},
            cuadroDB,
            {new: true});

        res.json(requisitoDB); 

    } catch (error) {
        return res.status(400).json({
        mensaje: 'Ocurrio un error',
        error
        })
    }
});

router.get('/solicitar/:id', async(req, res) => {
    const _id = req.params.id;
    try {
        const requisitoDB = await Requisito.findOne({_id});
        if(requisitoDB.estado === 'No realizado' || requisitoDB.estado === 'Rechazado' ){
            res.json(await Requisito.findByIdAndUpdate(_id, {estado : 'Pendiente'},{new: true}));
        }
        else{
            return res.status(400).json({
                mensaje: 'Estado debe ser No realizado o Rechazado'
                });
        }
    } catch (error) {
        return res.status(400).json({
        mensaje: 'Ocurrio un error',
        error
        })
    }
});

router.get('/aceptar/:id', async(req, res) => {
    const _id = req.params.id;
    try {
        const requisitoDB = await Requisito.findOne({_id});
        if(requisitoDB.estado === 'Pendiente'){
            res.json(await Requisito.findByIdAndUpdate(_id, {estado : 'Realizado'},{new: true}));
        }
        else{
            return res.status(400).json({
                mensaje: 'Estado debe ser Pendiente'
                });
        }  
    } catch (error) {
        return res.status(400).json({
        mensaje: 'Ocurrio un error',
        error
        })
    }
});

router.get('/rechazar/:id', async(req, res) => {
    const _id = req.params.id;
    try {
        const requisitoDB = await Requisito.findOne({_id});
        if(requisitoDB.estado === 'Pendiente'){
            res.json(await Requisito.findByIdAndUpdate(_id, {estado : 'Rechazado'},{new: true}));
        }
        else{
            return res.status(400).json({
                mensaje: 'Estado debe ser Pendiente'
                });
        }    
    } catch (error) {
        return res.status(400).json({
        mensaje: 'Ocurrio un error',
        error
        })
    }
});

module.exports = router;