var express = require('express');
var router = express.Router();
var Plan = require('../../models/plan.model');
var Cuadro_adelanto = require('../../models/cuadro.model');

router.post('/nuevo/:id', async(req, res) => {
    const _id = req.params.id;
    const body = req.body;

    try {
        var planDB = await Plan.findOne({_id});
        var cuadroDB = await Cuadro_adelanto.create(body);
        planDB.cuadros_adelanto.push(cuadroDB._id);
        await Plan.findByIdAndUpdate(
            _id,
            planDB,
            {new: true});
        res.json(cuadroDB); 
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
        const cuadroDB = await Cuadro_adelanto.findByIdAndUpdate(
        _id,
        body,
        {new: true});
        res.json(cuadroDB);  
    } catch (error) {
        return res.status(400).json({
        mensaje: 'Ocurrio un error',
        error
        })
    }
});

router.delete('/eliminar/:idcuadro/:idplan', async(req, res) => {
    const idplan = req.params.idplan;
    const idcuadro = req.params.idcuadro;

    try {
        const cuadroDB = await Cuadro_adelanto.findByIdAndDelete({_id:idcuadro});
        if(!cuadroDB){
            return res.status(400).json({
                mensaje: 'No se encontró el id indicado',
                error
            })
        }
        var planDB = await Plan.findOne({_id:idplan});
        var cuadros_adelanto = planDB.cuadros_adelanto.filter(x => {
            return x != idcuadro;
        });
        planDB.cuadros_adelanto=cuadros_adelanto;
        await Plan.findByIdAndUpdate(
            {_id : idplan},
            planDB,
            {new: true});

        res.json(cuadroDB); 

    } catch (error) {
        return res.status(400).json({
        mensaje: 'Ocurrio un error',
        error
        })
    }
});
module.exports = router;