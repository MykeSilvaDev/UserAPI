/*              Aula 293 Entendo a estrutura base  
                Aula 295 Modelando banco de dados 
  */


/*(1-293) AQUI VOU FAZER A CONEXÃO COM O BANCO DE DADOS  */
var knex = require('knex')({
    client: 'mysql2',
    connection: {
      host : '127.0.0.1',
      user : 'root',
      password : 'myke7250-',
/*(2-295) EU QUERO INTERAGIR COM O BANCO DE DADOS apiusers QUE EU CRIEI NO HeidiSQL */
      database : 'apiusers'
    }
  });
/*(1-293)*/
module.exports = knex