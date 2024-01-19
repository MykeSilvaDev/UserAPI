/*                              Aula 303 Geração de Token e Recuperação 
                                Aula 304 Alterando Senha 3   */

/*(2-303) ESTOU IMPORTANDO O BCRYPT E O MODEL DE USUÁRIO */
var knex = require("../database/connection");
var User = require("./User")


/*(1-303) O MÉTODO CREATE VAI RECEBER UM EMAIL, QUE SERÁ GERADO UM TOKE PARA ESSE EMAIL  */
class PasswordToken{
    async create(email){
// VOU CHAMAR O MODEL DE USUÁRIO
        var user = await User.findByEmail(email)
// SE USUÁRIO FOR DIFERENTE DE UNDEFINED SIGNIFICA QUE EU ACHEI NO BANCO DE DADOS
        if(user != undefined){
// COMO ESTOU UTILIZANDO A FUNÇÃO ASSÍNCRONA EU PRECISO USAR O TRY CACTH
        try{

/*(3-303) CRIANDO UMA VARIÁVEL CHAMADA TOKEN, EU VOU GERAR O TOKEN NESSA VARIÁVEL */
            var token = Date.now();

            /*(4-303) AQUI VOU GERAR O TOKEN PARA O MEU USUÁRIO COM A DATA ATUAL */
            await knex.insert({
                user_id: user.id,
                used: 0,
                token: token
// AQUI ESTOU DIZENDO PARA QUAL TABELA EU QUERO INSERIR OS DADOS 
            }).table("passwordtokens");
// SE TUDO OCORREU BM, VOU RETORNAR UM STATUS TRUE
            return {status: true, token: token}
        }catch(err){
            console.log(err);
            return {status: false, err: err}
        }
//SE NÃO SIGNIFICA QUE ESSE USUÁRIO NÃO EXISTE
        }else{
            return {status: false, err: "O e-mail informado não existe no banco de dados!"}
        }
    }

/*(5-304) VOU CRIAR UM MÉTODO E SUA FUNÇÃO É VALIDAR O TOKEN*/
    async validate(token){

        try{
            var result = await knex.select().where({token: token}).table("passwordtokens");
// VOU VERIFICAR SE ESSE RESULTADO (ARRAY É MAIOR QUE 0) SE FOR MAIOR, EXISTE ALGUMA COISA, POR ISSO ELE ME RETORNA
            if(result.length > 0){

                var tk = result[0];

/*TENHO QUE VERIFCAR SE TK O (token) FOI USADO OU NÃO, SE FOR USADO EU VOU DAR UM RETURN FALSO */
                if(tk.used){
                    return {status: false};
// SE NÃO FOR USADO EU VOU DAR UM RETURN TRUE
                }else{
/*EU CONSIGO PUXAR INFORMAÇÕES NO MEU CONTROLLER USANDO O TOKEN, POR EXEMPLO O ID DE USUÁRIO QUE AQUELE TOKEN PERTENCE */
                    return {status: true, token: tk};
                }
// SE NÃO É MAIOR QUE 0, É PORQUE NÃO EXISTE
            }else{
                return {status: false};
            }
        }catch(err){
            console.log(err)
            return {status: false};
        }
    }

/*(6-304) EU ALTEREI A SENHA MAS O TOKEN NÃO ESTA DADO COMO USADO (HEIDI Sql used 0) */
    // CRIAR MÉTODO CHAMADO SET USED
        async setUsed(token){
/*VOU ATUALIZAR USED PARA 1 QUE NO CASO É VERDADEIRO */
            await knex.update({used: 1}).where({token: token}).table("passwordtokens");
        }


}
module.exports = new PasswordToken();