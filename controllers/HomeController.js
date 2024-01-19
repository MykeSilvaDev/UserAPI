/*                      Aula 293 Entendo a estrutura base   */ 


/*(1-293) */
class HomeController{

    // /*(1-293)*/EU TENHO O MÉTOD INDEX, QUE EU ESTOU USANDO NO ARQUIVO (routes.js) (2-93)
    async index(req, res){
        res.send("APP EXPRESS! - Guia do programador");
    }

}

/*(2-293) EXPORTANDO UM NOVO OBJETO DO HomeController */
module.exports = new HomeController();