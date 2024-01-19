/*                      Aula 298 Cadastrando Usuário 
                        Aula 299 Busca de usuários 
                        Aula 300 Edição de Usuário 
                        Aula 301 Deletando Usuários 
                        Aula 303 Geração de token de recuperação 
                        Aula 304 Alterando Senha 
                        Aula 305 Login  */

/*(1-298) ESTOU PUXANDO O ARQUIVO DE CONFIGURAÇÃO COM O KNEX ,AGORA TENHO ACESSO AO BANCO DE DADOS*/
var knex = require("../database/connection");

/*(2-298) ESTOU IMPORTANDO A BIBLIOTEXA BCRYPT */
var bcrypt = require("bcrypt");
const PasswordToken = require("./PasswordToken");

/*(3-298) */
    class User{

/*(8-299) VOU DESENVOLVER UM MÉTODO PARA A LISTAGEM DE USUÁRIO*/
        async findAll(){
            try{
               var result = await knex.select("id","email","role","name").table("users");
               return result;
            }catch(err){
                console.log();
// SE ACONTECER ALGo, ERRO, EU VOU SIMPLESMENTE RETORNAR UM ARRAY VAZIO
                return [];
            }
        }

/*(9-299) VERIFICAR SE EXISTE ALGUM USUÁRIO E ME RETORNAR COM OS SEGUINTES DADOS (id, email, role, name)*/
        async findById(id){
            try{
                var result = await knex.select("id","email","role","name").where({id:id}).table("users");
// SE O TAMANHO DO RESULTADO FOR MAIOR DO QUE 0, SIGINIFICA QUE ELE ME RETORNOU ALGO
                if(result.length > 0){
                    return result[0];
// SE O ARRAY É IGUAL A 0, SIGNIFICA QUE ELE NÃO ACHOU NADA
                }else{
                    return undefined;
                }
             }catch(err){
                 console.log();
 // SE ACONTECER ALGUM ERRO, EU VOU SIMPLESMENTE RETORNAR UM ARRAY VAZIO
                 return undefined;
             }
        }


/*(16-303) VOU CRIAR UM MÉTODO CHAMADO FindByEmail 
EU PRECISO VERIFICAR SE O EMAIL ESTÁ CADASTRADO NO BANCO DE DADOS OU NÃO QUE O USUÁRIO TENTOU 
USAR PARA RECUPERAR A SENHA, E EU PRECISO PEGAR O ID DO USUÁRIO QUE TEM ESSE EMAIL*/
async findByEmail(email){
    try{

/*(18-305) O FINDBYEMAIL PRECISA RETORNAR A SENHA (password) DO USUÁRIO (ARQUIVO UserController 17-305)*/
        var result = await knex.select("id","email","password","role","name").where({email:email}).table("users");
// SE O TAMANHO DO RESULTADO FOR MAIOR DO QUE 0, SIGINIFICA QUE ELE ME RETORNOU ALGO
        if(result.length > 0){
            return result[0];
// SE O ARRAY É IGUAL A 0, SIGNIFICA QUE ELE NÃO ACHOU NADA
        }else{
            return undefined;
        }
     }catch(err){
         console.log();
// SE ACONTECER ALGUM ERRO, EU VOU SIMPLESMENTE RETORNAR UM ARRAY VAZIO
         return undefined;
     }
}



// NEW VAI RECEBER UM USUÁRIO PARA CADASTRAR
        async new(email, password, name){

/*(4-298) TRABALHAR COM TRY E CATCH PARA EVITAR ERROS*/
            try{
/*(5-298) O BCRYPT VAI RECEBER UMA SENHA, E NO CASO A QUANTIDADE DE VEZES QUE ELE VAI CRIPTOGRAFAR, NO CASO SÃO 10 VEZES*/
                var hash = await bcrypt.hash(password, 10);
/*O ROLE PARA TODOS OS USUÁRIOS SERÁ ZERO, ESTOU DIZENDO QUE O CAMPO SENHA NO MEU BANCO DE DADOS RECEBE O HASH*/
            await knex.insert({email, password:hash,name, role: 0}).table("users");
            }catch(err){
                console.log(err);
            }            
        }
/*(6-298) VOU CRIAR UM MÉTODO CHAMADO FINDEMAIL QUE VAI DIZER SE ALGUM EMAIL JA EXITE OU NÃO NO BANCO DE DADOS */
        async findEmail(email){ 
            try{
                /* estou pesquisando no meu banco de dados, NA (TABELA USERS) se existe algum usuário que tenha um email igual 
ao email que eu estou passando no parâmetro */
                var result = await knex.select("*").from("users").where({email: email})
                
/*(7-298) A LÓGICA É VERIFICAR SE O TAMANHO DO ARRAY DO RESULTADO É MAIOR DO QUE 0 QUE SIGINIFICA QUE TEM ALGUMA 
COISA NO ARRAY  */
                if(result.length > 0){
                    return true;
// SE NÃO FOR MAIOR DO QUE 0, SIGNIFICA QUE VOU RETORNAR FALSO
                }else{
                    return false;
                }
            }catch(err){
                console.log(result);
                console.log(err);
                return false;
            }
        }



 

/*(10-300) */
// VOU RECEBER 4 CAMPOS PARA EDITAR  
        async update(id,email,name,role){
// VOU VERIFICAR SE O USUÁRIO EXISTE OU NÃO, POR ISSO VOU UTILIZAR O MÉTODO FindById 9-299
            var user = await this.findById(id);

// SE EXISTE ESSE USUÁRIO ok
            if(user != undefined){

                var editUser = {};
// VOU VERIFICAR SE O EMAIL É DIFERENTE DE UNDEFINED
                if(email != undefined){
// VOU VERIFICAR SE ESSE EMAIL É DIFERENTE DO EMAIL ATUAL DO USUÁRIO
                    if(email != user.email){
                        var result = await this.findEmail(email);
// CASO RESULT SEJA FALSO, OU SEJA O USUÁRIO QUERER EDITAR UM EMAIL QUE NÃO SEJA DELE OU NÃO EXISTA NO BANCO DE DADOS
                        if(result == false){
// VOU PEGAR O OBJETO USER QUE VAI RECEBER O EMAIL
                            editUser.email = email;
// SE O EMAIL EXISTIR VOU RETORNAR QUE JÁ TEM CADASTRO
                        }else{
                            return {status: false, err: "O e-mail já está cadastrado"}
                        }
                    }
                }

/*(11-300) */
                if(name != undefined){
                    editUser.name = name;
                }

/*(12-300) */
                if(role != undefined){
                    editUser.role = role;
                }

/*(13-300) ESTOU PUXANDO O KNEX */
                try {
                    await knex.update(editUser).where({id: id}).table("users");
                    return {status: true}
// SE TUDO CORREU BEM, VOU RETORNAR PARA O MEU CONTROLLER O STATUS VERDADEIRO
                }catch(err){
                    return {status: false, err: err}
                }

/*(14-300) SE NÃO TEM ALGO ERRADO, CASO NÃO EXISTE EU RETORNO PARA O CONTROLLER ESSE OBJETO COM A MENSAGEM DE ERRO*/
            }else{
                return{status: false, err: "O usuário não existe!"}
            }
        }

/*(15-301) SISTEMA DE DELEÇÃO DE USUÁRIO */
            async delete(id){
/* DELETE [ 1º criar um delete que retorne para o meu controller, se o dado que eu quero deletar realmente existe, 
se o dado não existir eu retorno para o meu controller que o dado nao existe ] ESTOU UTILIZANDO O MÉTODO FindById    */   
                var user = await this.findById(id);
// SE O USUÁRIO ME RETORNAR DIFERENTE DE UNDEFINED, SIGNIFICA QUE O USUÁRIO EXISTE NO BANCO DE DADOS 
                if(user != undefined){

            try{
// SE O USUÁRIO EXISTIR DELETA ONDE O ID ESTÁ NA TABELA USERS
                await knex.delete().where({id: id}).table("users");
// CASO A OPERAÇÃO FOR UM SUCESSO EU VOU DAR UM RETURN 
                return {status: true};
            }catch(err){
                return {status: false, err: err}
            }
// SE FOR DIFERENTE DE UNDEFINED, SIGNIFICA QUE ELE NÃO EXITE NO BANCO
                }else{
                    return{status: false,err: "O usuário não existe, portando, não pode ser deletado!"}
                }
            }


/*(17-304) CRIAR MÉTODO CHANGE PASSWORD (usuário mudar a senha dele) */
            async changePassword(newPassword,id,token){
                var hash = await bcrypt.hash(newPassword, 10);
/*VOU CHAMAR O KNEX UPDATE E VOU ATUALIZAR UMA SENHA DE USUÁRIO COM O HASH NOVO ONDE ESSE USUÁRIO TENHA O ID 
IGUAL AO ID DO USUÁRIO DO TOKEN NA TABELA USERS */
                await knex.update({password: hash}).where({id:id}).table("users");
/*ESTOU CHAMANDO O MÉTODO SETUSED (ARQUIVO PasswordTokens 6-34) */
                await PasswordToken.setUsed(token);
            }

        }


module.exports = new User();