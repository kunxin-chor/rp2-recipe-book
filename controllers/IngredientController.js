
const model = require('../models/ingredients');
const controller = {
    add:function(req,res) {
        model.add(connection, req.body);
        res.send("Getting new ingredient");
    },
    list:function(req,res){
        res.json({
            'ingredients': [[]]
        })
    },
    delete:function(req,res) {
        res.send("Mock delete ingredient")
    }
}

module.exports = controller;