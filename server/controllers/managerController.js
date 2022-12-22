const jwt = require('jsonwebtoken');
const { sequelize } = require('../models');
const ManagerPersistence = require('../persistence/managerPersistence');
//importa as funções implementas para serem utilizadas nas operações abaixo
const { sendErrorMessage } = require('../helpers/api_helpers');
const { formatDatabaseDatetime } = require('../helpers/date_helpers');

/**
 * Classe responsável por tratar as requisições (como cadastros, alterações, remoções, consultas e etc) da API relacionadas a entidade Manager
 */
class ManagerController {

    /**
     * Método que implementa a requisição que cria um novo gerente na base de dados
     * @param req objeto que contém as informações da requisição 
     * @param res objeto que contém as informações da resposta da requisição
     */
    async createManager(req, res) {

        let transaction;

        try {

            /**
             * Cria uma transação, ela é importante pois se houver algum erro na operação, todas as manipulações feitas na base de dados são desfeitas
             */
            transaction = await sequelize.transaction();
            
            //cria um novo gerente na base de dados inserindo as informações recebidas no formato JSON através da requisição
            const newManager = await ManagerPersistence.createManager({
                userId: req.body.userId,
                createdAt: formatDatabaseDatetime(new Date()),
                updatedAt: formatDatabaseDatetime(new Date())
            }, { transaction });

            //comita na base de dados as operações realizadas
            await transaction.commit();
            //envia a resposta indicando que o cadastro foi realizado junto com as informações do gerente cadastrado
            res.status(201).send(newManager);
        }
        catch(error) {
            
            //se ocorreu algum erro
            if(transaction) {
                
                //desfaz quaisquer operações realizadas na base de dados
                await transaction.rollback();
            }

            //envia uma resposta indicando o erro que ocorreu na operação de cadastro
            sendErrorMessage(req, res, error, 'GERENTES', 'CADASTRO DE GERENTE', 500, 'error', 'Falha ao gerar o cadastro do gerente, tente novamente mais tarde');
        }
    }

    /**
     * Método que implementa a requisição que busca os gerentes na base de dados
     * PS: requisição não utilizada na API (feita apenas para testes)
     * @param req objeto que contém as informações da requisição 
     * @param res objeto que contém as informações da resposta da requisição
     */
    async searchManagers(req, res) {

        try {

            //obtém através dos parâmetros da requisição os filtros a serem utilizados na busca
            const { parameter, page, size } = req.query;
            //realiza a busca dos gerentes na base de dados
            const managersCollection = await ManagerPersistence.searchManagers(parameter, page, size);
            
            //envia como resposta os gerentes encontrados ou uma lista vazia
            res.status(200).send(managersCollection);
        }
        catch(error) {
            
            //em caso de falha, envia uma mensagem de erro indicando a falha que ocorreu durante o processo de busca
            sendErrorMessage(req, res, error, 'GERENTES', 'PESQUISA DE GERENTES', 500, 'error', 'Falha ao pesquisar gerentes, tente novamente mais tarde');
        }
    }

    /**
     * Método que implementa a requisição que busca um gerente por meio de seu id na base de dados
     * PS: requisição não utilizada na API (feita apenas para testes)
     * @param req objeto que contém as informações da requisição 
     * @param res objeto que contém as informações da resposta da requisição
     */
    async findManagerById(req, res) {

        try {

            //busca o gerente na base de dados por meio do seu id recebido como parâmetro na requisição
            const managerCollection = await ManagerPersistence.findManagerById(req.params.id);

            //se encontrou o gerente
            if(managerCollection) {

                //envia como resposta o usuario encontrado
                res.status(200).send(managerCollection);
            }
            else {

                //envia uma resposta indicando que o gerente não foi encontrado e o código 404
                sendErrorMessage(req, res, undefined, 'GERENTES', 'PESQUISA DE GERENTE POR ID', 404, 'warning', 'Gerente não encontrado');
            }
        }
        catch(error) {
            
            //em caso de falha, envia uma mensagem de erro indicando a falha que ocorreu durante o processo de busca
            sendErrorMessage(req, res, error, 'GERENTES', 'PESQUISA DE GERENTE POR ID', 500, 'error', 'Falha ao pesquisar o gerente, tente novamente mais tarde');
        }
    }

    /**
     * Método que implementa a requisição que atualiza o cadastro do gerente na base de dados
     * @param req objeto que contém as informações da requisição 
     * @param res objeto que contém as informações da resposta da requisição
     */
    async updateManager(req, res) {

        let transaction;

        try {

             /**
             * Cria uma transação, ela é importante pois se houver algum erro na operação, todas as manipulações feitas na base de dados são desfeitas
             */
            transaction = await sequelize.transaction();

            //obtém via parâmetro o id do gerente a ser atualizado
            const { id } = req.params;
            //atualiza as informações do gerente na base de dados atualizando as informações recebidas no formato JSON através da requisição
            const managerCollection = await ManagerPersistence.updateManager(id, {
                userId: req.body.userId,
                updatedAt: formatDatabaseDatetime(new Date())
            }, { transaction });

            //se o gerente de fato existe
            if(managerCollection) {
                
                //envia como resposta as informações do gerente que foi alterado
                res.status(200).send(managerCollection);
            }
            else {

                //envia uma resposta indicando que o gerente não foi encontrado e o código 404
                sendErrorMessage(req, res, undefined, 'GERENTES', 'ALTERAÇÃO DE GERENTE', 404, 'warning', 'Gerente não encontrado');
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
            sendErrorMessage(req, res, error, 'GERENTES', 'ALTERAÇÃO DE GERENTE', 500, 'error', 'Falha ao alterar o cadastro do gerente, tente novamente mais tarde');
        }
    }

    /**
     * Método que implementa a requisição que delete um gerente na base de dados
     * PS: requisição não utilizada na API (feita apenas para testes)
     * @param req objeto que contém as informações da requisição 
     * @param res objeto que contém as informações da resposta da requisição
     */
    async deleteManager(req, res) {

        let transaction;

        try {

             /**
             * Cria uma transação, ela é importante pois se houver algum erro na operação, todas as manipulações feitas na base de dados são desfeitas
             */
            transaction = await sequelize.transaction();

            //obtém via parâmetro o id do gerente a ser deletado
            const { id } = req.params;
            //deleta o gerente na base de dados por meio de seu id
            const managerCollection = await ManagerPersistence.deleteManager(id, { transaction });

            //se o gerente realmente existe
            if(managerCollection) {

                //envia como resposta as informações do gerente deletado
                res.status(200).send(managerCollection);
            }
            //caso não tenha encontrado
            else {

                //envia uma resposta indicando que o gerente não foi encontrado e o código 404
                sendErrorMessage(req, res, undefined, 'GERENTES', 'DELEÇÃO DE GERENTE', 404, 'warning', 'Gerente não encontrado');
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
            sendErrorMessage(req, res, error, 'GERENTES', 'DELEÇÃO DE GERENTE', 500, 'error', 'Falha ao deletar o seu cadastro, tente novamente mais tarde');
        }
    }

    /**
     * Método que implementa a requisição que deleta todos os gerentes na base de dados
     * PS: requisição não utilizada na API (feita apenas para testes)
     * @param req objeto que contém as informações da requisição 
     * @param res objeto que contém as informações da resposta da requisição
     */
    async deleteAllManagers(req, res) {

        let transaction;

        try {

             /**
             * Cria uma transação, ela é importante pois se houver algum erro na operação, todas as manipulações feitas na base de dados são desfeitas
             */
            transaction = await sequelize.transaction();

            //deleta todos os gerentes na base de dados
            await ManagerPersistence.deleteAllManagers({ transaction });
            //comita na base de dados as operações realizadas
            await transaction.commit();

            res.status(200).send("Todos os gerentes foram deletados");
        }
        catch(error) {
            
            //se ocorreu algum erro
            if(transaction) {
                
                //desfaz quaisquer operações realizadas na base de dados
                await transaction.rollback();
            }

            //envia uma resposta indicando a falha que ocorreu durante o processo de deleção
            sendErrorMessage(req, res, error, 'GERENTES', 'DELEÇÃO DE GERENTES', 500, 'error', 'Falha ao deletar o cadastro de todos gerentes, tente novamente mais tarde');
        }
    }

    /**
     * Método que implementa a requisição que conta o total de gerentes cadastrados na base de dados
     * PS: requisição não utilizada na API (feita apenas para testes)
     * @param req objeto que contém as informações da requisição 
     * @param res objeto que contém as informações da resposta da requisição
     */
     async countManagers(req, res) {

        try {

            //realiza a contagem dos gerentes cadastrados
            const countManagers = await ManagerPersistence.countManagers();

            //envia como resposta o total dos gerentes
            res.status(200).send(countManagers);
        }
        catch(error) {
            
            //em caso de erro, envia uma resposta indicando a falha que ocorreu
            sendErrorMessage(req, res, error, 'GERENTES', 'CONTAGEM DE GERENTES', 500, 'error', 'Falha ao processar a contagem de gerentes, tente novamente mais tarde');
        }
    }
}

module.exports = new ManagerController();