/*                          Aula 306 Autorização 04/06/23 */

/*(4-306) VOU IMPORTAR O JWT */
var jwt = require("jsonwebtoken");

/*(5-306) O SECRET PRECISA SER IGUAL AO QUE EU GEREI O TOKEN  ARQ UserController 18-305*/
var secret = "asdfçlkjasdfçlkj";


/* (1-306) FUNÇÃO QUE É EXPORTADA */
module.exports = function(req, res, next){
/* A FUNÇÃO DO MIDDLEWARE É INTERCEPTAR UMA FUNÇÃO COM A ROTA VER SE UMA DETERMINADA CONDIÇÃO É VERDADEIRA E DIZER SE ESSA 
REQUISIÇÃO VAI SER COMPLETADA OU NÃO (ver se tem um usuário logado com jwt é um admin, se for o usuário pode prosseguir 
na rota dele, se não for o usuário não prossegue na requisição) */

/*(2-306) */
// CABEÇALHO DA REQUISIÇÃO CHAMADO AUTHORIZATION
    const authToken = req.headers['authorization']

/* cabeçalho de autenticação que se chama bear, se esse cabeçalho existe eu divido ele em 2 */
    if(authToken != undefined){
        const bearer = authToken.split(' ');
        var token = bearer[1];

        try{
            // VAI ME RETORNAR UMA INFORMAÇÃO DECODIFICADA
            var decoded = jwt.verify(token,secret);

//SE O MEU CARGO FOR IGUAL A 1 POSSO ACESSAR NORMALMENTE          
            if(decoded.role == 1){
                next();
// SE NÃO EU VOU PRINTAR UMA MENSAGEM DE ERRO
            }else{
                res.status(403);
                res.send("Você não tem permissão para isso");
                return;        
            }

        }catch(err){
            res.status(403);
            res.send("Você não está autenticado");
            return;
        }


/*(3-306) SE O AUTHTOKEN FOR UNDEFINED, EU VOU DAR UMA MENSAGEM DE ERRO */    
    }else{
        res.status(403);
        res.send("Você não está autenticado");
        return;
    }

}