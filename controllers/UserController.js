            /*  Aula 296 Se adaptando a arquitetura de Controllers 
                Aula 297 Validação 
                Aula 298 Cadastrando usuário 
                Aula 299 Busca de usuários 
				Aula 300 Edição de Usuário 
                Aula 301 Deletando Usuários 
                Aula 303 Geração de token de recuperação 
                Aula 304 Alterando Senha 
                Aula 305 Login 
                 */

/*(5-298) VOU IMPORTAR O MODEL DE USUÁRIO*/
var User = require("../models/User");
/*(12-303) ESTOU CARREGANDO O MODEL PASSWORD */
var PasswordToken = require("../models/PasswordToken");
/*(16-305) IMPORTANDO BIBLIOTECA JWT */
var jwt = require("jsonwebtoken");

/*(18-305) PARA EU TER A PARTE DE FAZER UMA GERAÇÃO DE TOKEN EU PRECISO DO SECRET, É COMO SE FOSSE A CHAVE
DE CRIPTOGRAFIA DO MEU TOKEN  */
var secret = "asdfçlkjasdfçlkj";
/*(19-305) VOU IMPORTAR O BCRYPT PORQUE PRECISO UTILIZAR O MÉTODO DE COMPARAÇÃO */
var bcrypt = require("bcrypt");


/*                      (1-296) NESSA CLASSE EU VOU DEFINIR MÉTODOS */

class UserController{

/*(8-299) VOU CRIAR UM NOVO MÉTODO */
    async index(req, res){
// ESTOU CHAMANDO O MODEL QUE É UMA FUNÇÃO ASSÍNCRONA, POR ISSO COLOCO O AWAIT NA FRENTE DELE
        User.findAll();
            var users = await User.findAll();
            res.json(users);
    }

	
/*(9-299) CRIANDO UM NOVO MÉTODO */
    async findUser(req, res){
// O CLIENTE VAI PASSAR VIA PARÂMETRO O ID DO USUÁRIO ENTÃO EU VOU PUXAR O ID
        var id = req.params.id;
        var user = await User.findById(id);
// SE O USUÁRIO FOR DIFERENTE DE UNDEFINED, FAÇA ALGO OU SEJA, ELE NÃO ACHOU O USUÁRIO
        if(user == undefined){
			res.status(404);
			res.json({
				err: "Usuário não encontrado!"
			});
// SE NÃO FOR FAÇA OUTRA COISA, OU SEJA, ELE ENCONTROU O USUÁRIO
        }else{	
			res.status(200);
			res.json(user);
        }
    }
	


/*(2-296)MÉTODO CREATE, SERÁ RESPONSÁVEL POR PEGAR O CORPO DA REQUISIÇÃO DO USUÁRIO */
    async create (req, res){
/*(3-297) VOU EXTRAIR ESSAS 3 VARIÁVEIS DO OBJETO BODY */        
        var {email, name, password} = req.body;
// VOU VERIFICAR SE ESSE EMAIL É DIFERENTE DE UNDEFINED, VOU RETORNAR PARA O CLIENTE STATUS 403
        if(email == undefined){
            res.status(400);
            res.json({err: "O e-mail é inválido"})
// EU USO O RETURN, PORQUE NA HORA QUE ENCONTRAR ALGUM ERRO, ELE NÃO EXECUTA MAIS NADA EM BAIXO DO CÓDIGO
            return;
        }        

/*(7-298) ESTOU PEGANDO A VARIÁVEL EMAIL DA REQUISIÇÃO (ARQUIVO User.js) */
        var emailExists = await User.findEmail(email);
// SE O EMAIL EXISTE FAÇA ALGO, 
        if(emailExists){
            res.status(406);
            res.json({err: "O e-mail já está cadastrado!"})
// E PARA GARANTIR QUE NADA EM BAIXO SEJA EXECUTADO, EU VOU COLOCAR UM RETURN
            return;
        }


/*(4-297) */
        res.status = (200);
        res.send("Tudo OK!");

/*(6-298) ESTOU PASSANDO UM MÉTODO ASSÍNCRONO, SEMPRE PRECISO PASSAR O AWAIT ANTES, SE NÃO ELE NÃO
VAI INTERPRETAR O CÓDIGO E PULA PARA A PRÓXIMA LINHA*/
        await User.new(email,password,name);

        console.log(req.body);
        res.send("Pegando o corpo da requisição!")
    }

/*(10-300) VOU CRIAR UM CONTROLLER NOVO (MÉTODO) QUE INTERAJA COM O MÉTODO UPDATE (ARQUIVO User.js 10-300)  */
    async edit(req, res){
        var {id, name, role, email} = req.body;
// VOU ATUALIZAR UM USUÁRIO QUE TENHA UM DETERMINADO ID, EMAIL, NOME, ROLE
        var result = await User.update(id, email, name, role);
// SE RESULT É DIFERENTE DE UNDEFINED        
        if(result != undefined){
/* EU VOU VERIFICAR SE O STATUS QUE ESTOU RETORNANDO (ARQUIVO User.js 13-300) É VERDADEIRO OU FALSO  */
            if(result.status){
// SE O STATUS FOR VERDADEIRO SIGINIFICA QUE A OPERAÇÃO OCORREU COM SUCESSO
                res.status(200);
                res.send("Tudo OK!")
// SE OCORREU QUALQUER FALHA NA OPERAÇÃO    
            }else{
                res.status(406);
                res.send(result.err); 
            }
        }else{
            res.status(406);
            res.send("Ocorreu um erro no servidor!")
        }
    } 

/*(11-301)  OPERAÇÃO DE REMOÇÃO S*/
    async remove(req, res){
        var id  = req.params.id;
// ESTOU PASSANDO O ID QUE EU QUERO DELETAR DO RESULTADO DESSA OPERAÇÃO
        var result = await User.delete(id);

/*SE O RESULTADO DESSA OPERAÇÃO FOR POSITIVO, É VERDADEIRO E ACONTECEU COM SUCESSO */
        if(result.status){
           res.status(200);
           res.send("Tudo Ok!")
// SE O STATUS É FALSO, ACONTECEU UM ERRO
       }else{
           res.status(406);
           res.send(result.err);
       }
   }

/*(13-303) CRIAR UM NOVO MÉTODO RECOVER PASSWORD DE RECUPERAR A SENHA */
   async recoverPassword(req, res){
// O USUÁRIO VAI PASSAR PARA MIM VIA CORPO DA REQUISIÇÃO PARA MIM O EMAIL QUE ELE QUER RECUPERAR A SENHA
        var email = req.body.email;

        var result = await PasswordToken.create(email);
/* PRECISO VERIFICAR SE O RESULTADO.STATUS É VERDADEIRO, SE FOR OCORREU COM SUCESSO*/
        if(result.status){
            console.log(result.token);
            res.status(200);       
/* PRECISO CONVERTER PARA STRING,O SEND NÃO FUNCIONA BEM COM NUMEROS, O TOKEN COMO ME RETORNA UMA DATA, O EXPRESS
ENTENDE COMO STATUS CONVERTER EM STRING -> ( "" + )*/
            res.send("" + result.token);
// SE O STATUS É FALSO, OCORREU UMA FALHA NA OPERAÇÃO 
        }else{
            res.status(406)
            res.send(result.err);
        }
    }

/*(14-304) VOU CRIAR UM MÉTODO CHAMADO CHANGEPASSWORD (mudarsenha) */
    async changePassword(req, res){
// VAI RECEBER COMO O PARÂMETRO O TOKEN, VOU PASSAR O TOKEN VIA POST
        var token = req.body.token;
// VAI RECEBER A SENHA NOVA DO USUÁRIO
        var password = req.body.password;
// VALIDANDO O TOKEN
        var isTokenValid = await PasswordToken.validate(token);

// SE O TOKEN É VÁLIDO FAÇA ALGO
        if(isTokenValid.status){

/*(15-304) SE O TOKEN É VÁLIDO EU POSSO CHAMAR O MODEL DE USUÁRIO, EU VOU PASSAR A NOVA SENHA QUE O USUÁRIO VAI PASSAR
VIA CORPO DA REQUISIÇÃO */    
            await User.changePassword(password,isTokenValid.token.user_id,isTokenValid.token.token);
            res.status(200);
            res.send("Senha alterada");
// SE NÃO, FAÇA OUTRA COISA
        }else{
            res.status(406);
            res.send("Token inválido!");
        }
    }


/*(17-305) CRIANDO O MÉTODO DE LOGIN */
    async login(req, res){
        var {email, password} = req.body;

/*FAZENDO UMA BUSCA DO USUÁRIO POR EMAIL  */
        var user = await User.findByEmail(email);

/*SE USUÁRIO FOR DIFERENTE DE UNDEFINED SIGINIDCA QUE EU ACHEI ESSE USUÁRIO PELO EMAIL */
        if(user != undefined){
/*QUANDO EU ACHAR O USUÁRIO EU VOU FAZER UM BCRYPT.COMPARE, EU VOU COMPARAR A SENHA QUE ELE DIGITAR COM A SENHA
ENCRIPTADA DO USUÁRIO QUE EU ESTOU PUXANDO DO BANCO, VAI ME RETORNAR VERDADEIRO OU FALSO SE EU ACERTEI A SENHA*/
            var resultado = await bcrypt.compare(password, user.password);
            
/*SE RESULTADO FOR VERDADEIRO SIGNIFICA QUE A SENHA ESTA CERTA  */
            if(resultado){
// ESTOU PASSANDO O TOKEN JWT PASSANDO O EMAIL E O CARGO
                var token = jwt.sign({email: user.email, role: user.role}, secret);
                res.status(200);
                res.json({token: token});
// SE FOR FALSO EU MANDO UMA MSG DE SENHA INCORRETA
            }else{
                res.status(406);
                res.send("Senha Incorreta")
            }

/*SE EU NÃO ACHEI O USUÁRIO VAI SER FALSO POR PADRÃO */
        }else{
            res.json({status: false});
        }
    }
}

/*(3-293) EXPORTANDO MÓDULO QUE É IGUAL A UM NOVO OBJETO*/
module.exports = new UserController();
