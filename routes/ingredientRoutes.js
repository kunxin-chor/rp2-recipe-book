const express = require("express");
const router = express.Router();
const controller = require('../controllers/IngredientController');

router.get("/", controller.list);

router.get("/add", controller.add);

router.get("/delete", controller.delete);

module.exports = router;
