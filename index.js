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

app.get("/", function (req, res) {
  res.render("home.ejs");
});

// get all the recipes
app.get("/recipes", async function (req, res) {
  // the return value of pool.query is an array
  // element 1 of the array is all the rows
  // element 2 of the array is some metadata
  const [results] = await pool.query("SELECT * from recipes");

  // without array destructuring
  // const response = await pool.query("SELECT * from recipes");
  // const results = response[0];
  // res.json(results);  // res.json will format the argument as JavaScript object string
  res.render("recipes.ejs", {
    recipes: results,
  });
});

// one route to display the form
app.get("/recipes/add", function (req, res) {
  res.render("newRecipe");
});

// one route to process the form
app.post("/recipes", async function (req, res) {
  const { name, ingredients, instructions } = req.body;
  // eqv:
  // const name = req.body.name
  // const ingredients = req.body.ingredients
  // const instruction = req.body.instruction

  // mock example:
  try {
    const query = `INSERT INTO recipes (name, ingredients, instructions) VALUES (?, ?, ?);`;
    await pool.query(query, [name, ingredients, instructions]);
    res.redirect("/recipes"); // inform the browser to go to the url specified in the parameter
  } catch (e) {
    console.log(e);
    res.redirect("/error?errorMessage="+e);
  }
});

app.get('/error', function(req,res){
  res.send("Error encountered: " + req.query.errorMessage)
})

// we need a route parameter to know the id of the recipe we are editing
app.get('/recipes/:id/edit', async function(req,res){
  // pool.execute will be using MySQL prepared statements
  // pool.execute or pool.query will result in an array if you do a SELECT
  // even if there is only one result
  const [results] = await pool.execute("SELECT * FROM recipes WHERE id = ?", [req.params.id]);
  const recipe = results[0];

  res.render("editRecipe", {
    // recipe: recipe
    recipe
  })
});

// example: /recipes/3
// in this case: req.params.id ==> 3
app.post('/recipes/:id', async function(req,res){
  // get the id of the recipe we want to create
  const id = req.params.id;
  const {name, ingredients, instructions} = req.body;
  const query = `
  UPDATE recipes 
    SET name=?,
        ingredients=?,
        instructions=?
    WHERE id = ?;
  `;
  await pool.query(query, [name, ingredients, instructions, id]);
  res.redirect("/recipes");
})

// if the url is recipes/3/delete ==> delete the recipe with the id 3
app.get('/recipes/:id/delete', async function(req,res){
  const id = req.params.id; 
  const query = "DELETE FROM recipes WHERE id=?";
  await pool.query(query, [id]);
  res.redirect('/recipes');

});

// start server
app.listen(8080, function () {
  console.log("Express server has started");
});
