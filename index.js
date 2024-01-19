/*                      Aula 293 Entendo a estrutura base   */ 


/*(1-293)                           [ MÓDULOS ]     */

// 1 MOD É O BODY PARSER = utilizar para receber dados via JSON  

/*(1-293)*/
var bodyParser = require('body-parser')
/*(1-293)*/
var express = require("express")
/*(1-293)*/
var app = express()
// /*(1-293)*/ESTOU IMPORTANDO DA PASTA ROUTES (ARQUIVO routes.js)
var router = require("./routes/routes")
 
// /*(1-293)*/parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// /*(1-293)*/parse application/json
app.use(bodyParser.json())

// /*(1-293)*/ARQUIVO DE ROTEAMENTO
app.use("/",router);
/*(1-293)*/
app.listen(8080,() => {
    console.log("Servidor rodando")
});
