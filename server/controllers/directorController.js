const { sequelize } = require('../models');
const DirectorPersistence = require('../persistence/directorPersistence');
//importa as funções implementas para serem utilizadas nas operações abaixo
const { sendErrorMessage } = require('../helpers/api_helpers');
const { formatDatabaseDatetime } = require('../helpers/date_helpers');

/**
 * Classe responsável por tratar as requisições (como cadastros, alterações, remoções, consultas e etc) da API relacionadas a entidade Director
 */
class DirectorController {

    /**
     * Método que implementa a requisição que cria um novo diretor na base de dados
     * @param req objeto que contém as informações da requisição 
     * @param res objeto que contém as informações da resposta da requisição
     */
    async createDirector(req, res) {

        let transaction;

        try {
            
            /**
             * Cria uma transação, ela é importante pois se houver algum erro na operação, todos as manipulações feitas na base de dados são desfeitas
             */
            transaction = await sequelize.transaction();

            //cria um novo diretor na base de dados inserindo as informações recebidas no formato JSON através da requisição
            const newDirector = await DirectorPersistence.createDirector({
                userId: req.body.userId,
                generalManager: req.body.generalManager,
                createdAt: formatDatabaseDatetime(new Date()),
                updatedAt: formatDatabaseDatetime(new Date())
            }, { transaction });
            
            //comita na base de dados as operações realizadas
            await transaction.commit();
            //envia a resposta indicando que o cadastro foi realizado junto com as informações da diretor cadastrado
            res.status(201).send(newDirector);
        }
        catch(error) {
            
            //se ocorreu algum erro
            if(transaction) {
                    
                //desfaz quaisquer operações realizadas na base de dados
                await transaction.rollback();
            }

            //envia um resposta indicando o erro que ocorreu na operação de cadastro
            sendErrorMessage(req, res, error, 'DIRETORIAS', 'CADASTRO DE DIRETOR', 500, 'error', 'Falha ao gerar o cadastro da diretor, tente novomente mais tarde');
        }
    }

    /**
     * Método que implementa a requisição que busca diretores na base de dados
     * @param req objeto que contém as informações da requisição 
     * @param res objeto que contém as informações da resposta da requisição
     */
    async searchDirectors(req, res) {

        try {
            //obtém através dos parâmetros da requisição os filtros a serem utilizados na busca
            const { parameter, page, size } = req.query;
            //realiza a busca das diretores na base de dados
            const directorsCollection = await DirectorPersistence.searchDirectors(parameter, page, size);

            //envia como resposta as diretores encontrados ou um lista vazia
            res.status(200).send(directorsCollection);
        }
        catch(error) {
            
            //em caso de falha, envia um mensagem de erro indicando a falha que ocorreu durante o processo de busca
            sendErrorMessage(req, res, error, 'DIRETORIAS', 'PESQUISA DE DIRETORIAS', 500, 'error', 'Falha ao pesquisar directors, tente novomente mais tarde');
        }
    }

    /**
     * Método que implementa a requisição que busca um diretor por meio de seu id na base de dados
     * PS: requisição não utilizada na API (feita apenas para testes)
     * @param req objeto que contém as informações da requisição 
     * @param res objeto que contém as informações da resposta da requisição
     */
    async findDirectorById(req, res) {

        try {

            //busca a diretor na base de dados por meio do seu id recebido como parâmetro na requisição
            const directorCollection = await DirectorPersistence.findDirectorById(req.params.id);

            //se encontrou a diretor
            if(directorCollection) {

                //envia como resposta a diretor encontrado
                res.status(200).send(directorCollection);
            }
            else {

                //envia um resposta indicando que a diretor não foi encontrado e o código 404
                sendErrorMessage(req, res, undefined, 'DIRETORIAS', 'PESQUISA DE DIRETOR POR ID', 404, 'warning', 'Diretor não encontrado');
            }
        }
        catch(error) {
            
            //em caso de falha, envia um mensagem de erro indicando a falha que ocorreu durante o processo de busca
            sendErrorMessage(req, res, error, 'DIRETORIAS', 'PESQUISA DE DIRETOR POR ID', 500, 'error', 'Falha ao pesquisar a diretor, tente novomente mais tarde');
        }
    }

    /**
     * Método que implementa a requisição que atualiza o cadastro de um diretor na base de dados
     * @param req objeto que contém as informações da requisição 
     * @param res objeto que contém as informações da resposta da requisição
     */
    async updateDirector(req, res) {

        let transaction;

        try {

            /**
             * Cria uma transação, ela é importante pois se houver algum erro na operação, todos as manipulações feitas na base de dados são desfeitas
             */
            transaction = await sequelize.transaction();

            //obtém via parâmetro o id da diretor a ser deletado
            const { id } = req.params;
            //atualiza as informações da diretor na base de dados atualizando as informações recebidas no formato JSON através da requisição
            const directorCollection = await DirectorPersistence.updateDirector(id, {

                userId: req.body.userId,
                generalManager: req.body.generalManager,
                updatedAt: formatDatabaseDatetime(new Date())
            }, { transaction });

            //se a diretor de fato existe
            if(directorCollection) {
                
                //envia como resposta as informações da diretor que foi alterado
                res.status(200).send(directorCollection);
            }
            else {

                //envia um resposta indicando que a diretor não foi encontrado e o código 404
                sendErrorMessage(req, res, undefined, 'DIRETORIAS', 'ALTERAÇÃO DE DIRETOR', 404, 'warning', 'Diretor não encontrado');
            }

            //comita na base de dados as operações realizadas
            await transaction.commit();
        }
        catch(error) {
            
            //se ocorreu algum erro
            if(transaction) {
                
                //desfaz quaisquer operações realizadas na base de dados
                await transaction.rollback();
            }

            //em caso de falha envia um mensagem indicando a falha ocorrida
            sendErrorMessage(req, res, error, 'DIRETORIAS', 'ALTERAÇÃO DE DIRETOR', 500, 'error', 'Falha ao alterar o cadastro da diretor, tente novomente mais tarde');
        }
    }

    /**
     * Método que implementa a requisição que delete um diretor na base de dados
     * @param req objeto que contém as informações da requisição 
     * @param res objeto que contém as informações da resposta da requisição
     */
    async deleteDirector(req, res) {

        let transaction;

        try {

            /**
             * Cria uma transação, ela é importante pois se houver algum erro na operação, todos as manipulações feitas na base de dados são desfeitas
             */
            transaction = await sequelize.transaction();

            //obtém via parâmetro o id da diretor a ser deletado
            const { id } = req.params;
            //deleta a diretor na base de dados por meio de seu id
            const directorCollection = await DirectorPersistence.deleteDirector(id, { transaction });

            //se a diretor realmente existe
            if(directorCollection) {

                //envia como resposta as informações da diretor deletado
                res.status(200).send(directorCollection);
            }
            //caso não tenha encontrado
            else {

                //envia um resposta indicando que a diretor não foi encontrado e o código 404
                sendErrorMessage(req, res, undefined, 'DIRETORIAS', 'DELEÇÃO DE DIRETOR', 404, 'warning', 'Diretor não encontrado');
            }

            //comita na base de dados as operações realizadas
            await transaction.commit();
        }
        catch(error) {
            
            //se ocorreu algum erro
            if(transaction) {
                
                //desfaz quaisquer operações realizadas na base de dados
                await transaction.rollback();
            }

            //envia um resposta indicando a falha que ocorreu durante o processo de deleção
            sendErrorMessage(req, res, error, 'DIRETORIAS', 'DELEÇÃO DE DIRETOR', 500, 'error', 'Falha ao deletar o cadastro da diretor, tente novomente mais tarde');
        }
    }

    /**
     * Método que implementa a requisição que deleta todos as diretores na base de dados
     * PS: requisição não utilizada na API (feita apenas para testes)
     * @param req objeto que contém as informações da requisição 
     * @param res objeto que contém as informações da resposta da requisição
     */
    async deleteAllDirectors(req, res) {

        let transaction;

        try {

            /**
             * Cria uma transação, ela é importante pois se houver algum erro na operação, todos as manipulações feitas na base de dados são desfeitas
             */
            transaction = await sequelize.transaction();
            
            //deleta todos as diretores na base de dados
            await DirectorPersistence.deleteAllDirectors({ transaction });

            //comita na base de dados as operações realizadas
            await transaction.commit();
            res.status(200).send("Todos as diretores foram deletados");
        }
        catch(error) {
            
            //se ocorreu algum erro
            if(transaction) {
                
                //desfaz quaisquer operações realizadas na base de dados
                await transaction.rollback();
            }

            //envia um resposta indicando a falha que ocorreu durante o processo de deleção
            sendErrorMessage(req, res, error, 'DIRETORIAS', 'DELEÇÃO DE DIRETORIAS', 500, 'error', 'Falha ao deletar o cadastro de todos diretores, tente novomente mais tarde');
        }
    }

    /**
     * Método que implementa a requisição que cria um novo usuário na base de dados
     * @param req objeto que contém as informações da requisição 
     * @param res objeto que contém as informações da resposta da requisição
     */
    async countDirectors(req, res) {

        try {
            //realiza a contagem das diretores
            const countDirectors = await DirectorPersistence.countDirectors();
            
            //envia o total de diretores
            res.send(countDirectors);
        }
        catch(error) {

            //em caso de falha envia um resposta com o erro ocorrido
            sendErrorMessage(req, res, error, 'DIRETORIAS', 'CONTAGEM DE DIRETORIAS', 500, 'error', 'Falha ao obter os indicadores de diretores, tente novomente mais tarde');
        }
    }
}

module.exports = new DirectorController();