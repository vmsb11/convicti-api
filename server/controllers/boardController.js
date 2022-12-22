const { sequelize } = require('../models');
const BoardPersistence = require('../persistence/boardPersistence');
//importa as funções implementas para serem utilizadas nas operações abaixo
const { sendErrorMessage } = require('../helpers/api_helpers');
const { formatDatabaseDatetime } = require('../helpers/date_helpers');

/**
 * Classe responsável por tratar as requisições (como cadastros, alterações, remoções, consultas e etc) da API relacionadas a entidade Board
 */
class BoardController {

    /**
     * Método que implementa a requisição que cria um nova diretoria na base de dados
     * @param req objeto que contém as informações da requisição 
     * @param res objeto que contém as informações da resposta da requisição
     */
    async createBoard(req, res) {

        let transaction;

        try {
            
            /**
             * Cria uma transação, ela é importante pois se houver algum erro na operação, todas as manipulações feitas na base de dados são desfeitas
             */
            transaction = await sequelize.transaction();

            //cria um nova diretoria na base de dados inserindo as informações recebidas no formato JSON através da requisição
            const newBoard = await BoardPersistence.createBoard({
                directorId: req.body.directorId,
                name: req.body.name,
                createdAt: formatDatabaseDatetime(new Date()),
                updatedAt: formatDatabaseDatetime(new Date())
            }, { transaction });
            
            //comita na base de dados as operações realizadas
            await transaction.commit();
            //envia a resposta indicando que o cadastro foi realizado junto com as informações da diretoria cadastrado
            res.status(201).send(newBoard);
        }
        catch(error) {
            
            //se ocorreu algum erro
            if(transaction) {
                    
                //desfaz quaisquer operações realizadas na base de dados
                await transaction.rollback();
            }

            //envia uma resposta indicando o erro que ocorreu na operação de cadastro
            sendErrorMessage(req, res, error, 'DIRETORIAS', 'CADASTRO DE DIRETORIA', 500, 'error', 'Falha ao gerar o cadastro da diretoria, tente novamente mais tarde');
        }
    }

    /**
     * Método que implementa a requisição que busca diretorias na base de dados
     * @param req objeto que contém as informações da requisição 
     * @param res objeto que contém as informações da resposta da requisição
     */
    async searchBoards(req, res) {

        try {
            //obtém através dos parâmetros da requisição os filtros a serem utilizados na busca
            const { parameter, page, size } = req.query;
            //realiza a busca das diretorias na base de dados
            const boardsCollection = await BoardPersistence.searchBoards(parameter, page, size);

            //envia como resposta as diretorias encontrados ou uma lista vazia
            res.status(200).send(boardsCollection);
        }
        catch(error) {
            console.log(error);
            //em caso de falha, envia uma mensagem de erro indicando a falha que ocorreu durante o processo de busca
            sendErrorMessage(req, res, error, 'DIRETORIAS', 'PESQUISA DE DIRETORIAS', 500, 'error', 'Falha ao pesquisar diretorias, tente novamente mais tarde');
        }
    }

    /**
     * Método que implementa a requisição que busca uma diretoria por meio de seu id na base de dados
     * PS: requisição não utilizada na API (feita apenas para testes)
     * @param req objeto que contém as informações da requisição 
     * @param res objeto que contém as informações da resposta da requisição
     */
    async findBoardById(req, res) {

        try {

            //busca a diretoria na base de dados por meio do seu id recebido como parâmetro na requisição
            const boardCollection = await BoardPersistence.findBoardById(req.params.id);

            //se encontrou a diretoria
            if(boardCollection) {

                //envia como resposta a diretoria encontrado
                res.status(200).send(boardCollection);
            }
            else {

                //envia uma resposta indicando que a diretoria não foi encontrado e o código 404
                sendErrorMessage(req, res, undefined, 'DIRETORIAS', 'PESQUISA DE DIRETORIA POR ID', 404, 'warning', 'Diretoria não encontrada');
            }
        }
        catch(error) {
            
            //em caso de falha, envia uma mensagem de erro indicando a falha que ocorreu durante o processo de busca
            sendErrorMessage(req, res, error, 'DIRETORIAS', 'PESQUISA DE DIRETORIA POR ID', 500, 'error', 'Falha ao pesquisar a diretoria, tente novamente mais tarde');
        }
    }

    /**
     * Método que implementa a requisição que atualiza o cadastro de uma diretoria na base de dados
     * @param req objeto que contém as informações da requisição 
     * @param res objeto que contém as informações da resposta da requisição
     */
    async updateBoard(req, res) {

        let transaction;

        try {

            /**
             * Cria uma transação, ela é importante pois se houver algum erro na operação, todas as manipulações feitas na base de dados são desfeitas
             */
            transaction = await sequelize.transaction();

            //obtém via parâmetro o id da diretoria a ser deletado
            const { id } = req.params;
            //atualiza as informações da diretoria na base de dados atualizando as informações recebidas no formato JSON através da requisição
            const boardCollection = await BoardPersistence.updateBoard(id, {

                directorId: req.body.directorId,
                name: req.body.name,
                updatedAt: formatDatabaseDatetime(new Date())
            }, { transaction });

            //se a diretoria de fato existe
            if(boardCollection) {
                
                //envia como resposta as informações da diretoria que foi alterado
                res.status(200).send(boardCollection);
            }
            else {

                //envia uma resposta indicando que a diretoria não foi encontrado e o código 404
                sendErrorMessage(req, res, undefined, 'DIRETORIAS', 'ALTERAÇÃO DE DIRETORIA', 404, 'warning', 'Diretoria não encontrada');
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

            //em caso de falha envia uma mensagem indicando a falha ocorrida
            sendErrorMessage(req, res, error, 'DIRETORIAS', 'ALTERAÇÃO DE DIRETORIA', 500, 'error', 'Falha ao alterar o cadastro da diretoria, tente novamente mais tarde');
        }
    }

    /**
     * Método que implementa a requisição que delete uma diretoria na base de dados
     * @param req objeto que contém as informações da requisição 
     * @param res objeto que contém as informações da resposta da requisição
     */
    async deleteBoard(req, res) {

        let transaction;

        try {

            /**
             * Cria uma transação, ela é importante pois se houver algum erro na operação, todas as manipulações feitas na base de dados são desfeitas
             */
            transaction = await sequelize.transaction();

            //obtém via parâmetro o id da diretoria a ser deletado
            const { id } = req.params;
            //deleta a diretoria na base de dados por meio de seu id
            const boardCollection = await BoardPersistence.deleteBoard(id, { transaction });

            //se a diretoria realmente existe
            if(boardCollection) {

                //envia como resposta as informações da diretoria deletado
                res.status(200).send(boardCollection);
            }
            //caso não tenha encontrado
            else {

                //envia uma resposta indicando que a diretoria não foi encontrado e o código 404
                sendErrorMessage(req, res, undefined, 'DIRETORIAS', 'DELEÇÃO DE DIRETORIA', 404, 'warning', 'Diretoria não encontrada');
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

            //envia uma resposta indicando a falha que ocorreu durante o processo de deleção
            sendErrorMessage(req, res, error, 'DIRETORIAS', 'DELEÇÃO DE DIRETORIA', 500, 'error', 'Falha ao deletar o cadastro da diretoria, tente novamente mais tarde');
        }
    }

    /**
     * Método que implementa a requisição que deleta todos as diretorias na base de dados
     * PS: requisição não utilizada na API (feita apenas para testes)
     * @param req objeto que contém as informações da requisição 
     * @param res objeto que contém as informações da resposta da requisição
     */
    async deleteAllBoards(req, res) {

        let transaction;

        try {

            /**
             * Cria uma transação, ela é importante pois se houver algum erro na operação, todas as manipulações feitas na base de dados são desfeitas
             */
            transaction = await sequelize.transaction();
            
            //deleta todos as diretorias na base de dados
            await BoardPersistence.deleteAllBoards({ transaction });

            //comita na base de dados as operações realizadas
            await transaction.commit();
            res.status(200).send("Todos as diretorias foram deletados");
        }
        catch(error) {
            
            //se ocorreu algum erro
            if(transaction) {
                
                //desfaz quaisquer operações realizadas na base de dados
                await transaction.rollback();
            }

            //envia uma resposta indicando a falha que ocorreu durante o processo de deleção
            sendErrorMessage(req, res, error, 'DIRETORIAS', 'DELEÇÃO DE DIRETORIAS', 500, 'error', 'Falha ao deletar o cadastro de todas diretorias, tente novamente mais tarde');
        }
    }

    /**
     * Método que implementa a requisição que cria um novo usuário na base de dados
     * @param req objeto que contém as informações da requisição 
     * @param res objeto que contém as informações da resposta da requisição
     */
    async countBoards(req, res) {

        try {
            //realiza a contagem das diretorias
            const countBoards = await BoardPersistence.countBoards();
            
            //envia o total de diretorias
            res.send(countBoards);
        }
        catch(error) {

            //em caso de falha envia uma resposta com o erro ocorrido
            sendErrorMessage(req, res, error, 'DIRETORIAS', 'CONTAGEM DE DIRETORIAS', 500, 'error', 'Falha ao obter os indicadores de diretorias, tente novamente mais tarde');
        }
    }
}

module.exports = new BoardController();