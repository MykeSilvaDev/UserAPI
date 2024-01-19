                        /* Aula 293 Entendo a estrutura base   
                           Aula 296 Se adaptando a arquitetura de Controllers 
                           Aula 299 Busca de Usuários 
                           Aula 300 Edição de usuário 
                           Aula 301 Deletando Usuários 
                           Aula 303 Geração de token e recuperação 
                           Aula 304 Alterando Senha
                           Aula 305 Login  
                           Aula 306 Autorização */


/*(1-293)                           [ MÓDULOS ]     */

// 1 MOD É O BODY PARSER = utilizar para receber dados via JSON     
var express = require("express");
/*(1-293)*/
var app = express();
/*(1-293)*/
var router = express.Router();
/*(1-293)*/
var HomeController = require("../controllers/HomeController");
/*(3-296) IMPORTANDO USE.CONTROLLER  */
var UserController = require("../controllers/UserController");
/*(IMPORTANDO ADMINAUTH - PASTA MIDDLEWARE) */
/*(12-306) */
var AdminAuth = require("../middleware/AdminAuth");


/*                         [ TODAS AS ROTAS DA MINHA APLICAÇÃO EU VOU DEFINIR AQUI ] */

/*ROTA PRINCIPAL DA MINHA APLICAÇÃO, AQUI ESTOU CHAMANDO UMA FUNÇÃO CHAMADA (index), QUE ESTA DENTRO DO (HomeController)
QUE É RESPONSÁVEL POR CONTROLAR O FLUXO DE DADOS DA MINHA APLICAÇÃO (EX: se o usuário entra rota /login, o HomeController
é responsável pelo que vai acontecer nessa rota ) */

/* (2-93) IMPORTANDO DA PASTA (controllers) DO ARQUIVO (HomeController.js)*/
router.get('/', HomeController.index);

/* (4-296) TODA VEZ QUE EU ACESSAR A ESSA ROTA /USER, ELE VAI CHAMAR O MÉTODO CREATE*/
router.post('/user', UserController.create);

/*(13-306) INSERINDO O MIDDLEWARE NESSA ROTA DE LISTAGEM DE USUÁRIO */
/*(5-299) PELO FATO DE ESTAR USANDO O VERBO GET/USER O PROGRAMADOR VAI SABER -QUE É UMA ROTA QUE RETORNA 
TODOS OS USUÁRIOS, ASSIM VOU CHAMAR O MÉTOD INDEX (ARQUIVO UserController.js 8-299) */
router.get("/user",AdminAuth,UserController.index);

/*(6-299) QUANDO O USUÁRIO ACESSAR ESSA ROTA, VAI PUXAR O MÉTODO DO CONTROLLER (AQRUIVO UserController 
findUser 9-299) */
router.get("/user/:id",AdminAuth, UserController.findUser);

/*(7-300) QUANDO O USUÁRIO ACESSAR ESSA ROTA, VAI PUXAR O MÉTODO DO CONTROLLER (ARQUIVO UserController
edit (10-300), SÓ PELO FATO DA ROTA SER DO TIPO PUT, O PROGRAMADOR, SABE QUE ESSA ROTA SERVE PARA EDITAR OS DADOS
DO USUÁRIO*/
router.put("/user",AdminAuth, UserController.edit);

/*(8-301) QUANDO O USUÁRIO ACESSAR ESSA ROTA, VAI PUXAR O MÉTODO DO CONTROLLER (ARQUIVO UserController
(remove 11-301) */
router.delete("/user/:id", AdminAuth,UserController.remove);

/*(9-303) QUANDO O USUÁRIO ACESSAR ESSA ROTA, VAI PUXAR O MÉTODO DO CONTROLLER (ARQUIVO UserController
(13-303)*/
router.post("/recoverpassword", UserController.recoverPassword);

/*(10-304) QUANDO O USUÁRIO ACESSAR ESSA ROTA, VAI PUXAR O MÉTODO DO CONTROLLER (ARQUIVO UserController)
(14-304) */
router.post("/changepassword",UserController.changePassword);

/*(11-305) PUXA O MÉTODO DO CONTROLLER (ARQUIVO UserController)
(17-305)*/
router.post("/login", UserController.login);

/*(1-293)*/
module.exports = router;