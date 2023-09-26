const express = require("express");
const ejs = require("ejs");
const mysql = require("mysql2/promise");
require("dotenv").config(); // read in the .env file

const app = express();

// allow Express to process forms
app.use(
  express.urlencoded({
    extended: false,
  })
);

// setup the database (create a connection pool)
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0, // 0 means infinite queue
});

app.set("view engine", "ejs");

// require in the recipe routes
const recipeRoutes = require('./routes/recipeRoutes');
const ingredientRoutes = require('./routes/ingredientRoutes');
app.use('/recipes', recipeRoutes);
app.use('/ingredients', ingredientRoutes);

app.get("/", function (req, res) {
  res.render("home.ejs");
});





app.get('/api/recipies', async function(req,res){
  // get all the recipes;
  // send back the recipes as JSON
  res.json({
    recipes:[]
  })
})

// start server
app.listen(8080, function () {
  console.log("Express server has started");
});
