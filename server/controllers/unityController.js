const { sequelize } = require('../models');
const UnityPersistence = require('../persistence/unityPersistence');
//importa as funções implementas para serem utilizadas nas operações abaixo
const { sendErrorMessage } = require('../helpers/api_helpers');
const { formatDatabaseDatetime } = require('../helpers/date_helpers');

/**
 * Classe responsável por tratar as requisições (como cadastros, alterações, remoções, consultas e etc) da API relacionadas a entidade Unity
 */
class UnityController {

    /**
     * Método que implementa a requisição que cria um nova unidade na base de dados
     * @param req objeto que contém as informações da requisição 
     * @param res objeto que contém as informações da resposta da requisição
     */
    async createUnity(req, res) {

        let transaction;

        try {
            
            /**
             * Cria uma transação, ela é importante pois se houver algum erro na operação, todas as manipulações feitas na base de dados são desfeitas
             */
            transaction = await sequelize.transaction();

            //cria um nova unidade na base de dados inserindo as informações recebidas no formato JSON através da requisição
            const newUnity = await UnityPersistence.createUnity({
                managerId: req.body.managerId,
                boardId: req.body.boardId,
                name: req.body.name, 
                latLon: req.body.latLon,
                createdAt: formatDatabaseDatetime(new Date()),
                updatedAt: formatDatabaseDatetime(new Date())
            }, { transaction });
            
            //comita na base de dados as operações realizadas
            await transaction.commit();
            //envia a resposta indicando que o cadastro foi realizado junto com as informações da unidade cadastrado
            res.status(201).send(newUnity);
        }
        catch(error) {
            
            //se ocorreu algum erro
            if(transaction) {
                    
                //desfaz quaisquer operações realizadas na base de dados
                await transaction.rollback();
            }

            //envia uma resposta indicando o erro que ocorreu na operação de cadastro
            sendErrorMessage(req, res, error, 'UNIDADES', 'CADASTRO DE UNIDADE', 500, 'error', 'Falha ao gerar o cadastro da unidade, tente novamente mais tarde');
        }
    }

    /**
     * Método que implementa a requisição que busca unidades na base de dados
     * @param req objeto que contém as informações da requisição 
     * @param res objeto que contém as informações da resposta da requisição
     */
    async searchUnits(req, res) {

        try {
            //obtém através dos parâmetros da requisição os filtros a serem utilizados na busca
            const { boardId, parameter, page, size } = req.query;
            //realiza a busca das unidades na base de dados
            const unitsCollection = await UnityPersistence.searchUnits(boardId, parameter, page, size);

            //envia como resposta as unidades encontrados ou uma lista vazia
            res.status(200).send(unitsCollection);
        }
        catch(error) {
            
            //em caso de falha, envia uma mensagem de erro indicando a falha que ocorreu durante o processo de busca
            sendErrorMessage(req, res, error, 'UNIDADES', 'PESQUISA DE UNIDADES', 500, 'error', 'Falha ao pesquisar units, tente novamente mais tarde');
        }
    }

    /**
     * Método que implementa a requisição que busca uma unidade por meio de seu id na base de dados
     * PS: requisição não utilizada na API (feita apenas para testes)
     * @param req objeto que contém as informações da requisição 
     * @param res objeto que contém as informações da resposta da requisição
     */
    async findUnityById(req, res) {

        try {

            //busca a unidade na base de dados por meio do seu id recebido como parâmetro na requisição
            const unityCollection = await UnityPersistence.findUnityById(req.params.id);

            //se encontrou a unidade
            if(unityCollection) {

                //envia como resposta a unidade encontrado
                res.status(200).send(unityCollection);
            }
            else {

                //envia uma resposta indicando que a unidade não foi encontrado e o código 404
                sendErrorMessage(req, res, undefined, 'UNIDADES', 'PESQUISA DE UNIDADE POR ID', 404, 'warning', 'Unidade não encontrada');
            }
        }
        catch(error) {
            
            //em caso de falha, envia uma mensagem de erro indicando a falha que ocorreu durante o processo de busca
            sendErrorMessage(req, res, error, 'UNIDADES', 'PESQUISA DE UNIDADE POR ID', 500, 'error', 'Falha ao pesquisar a unidade, tente novamente mais tarde');
        }
    }

    /**
     * Método que implementa a requisição que atualiza o cadastro de uma unidade na base de dados
     * @param req objeto que contém as informações da requisição 
     * @param res objeto que contém as informações da resposta da requisição
     */
    async updateUnity(req, res) {

        let transaction;

        try {

            /**
             * Cria uma transação, ela é importante pois se houver algum erro na operação, todas as manipulações feitas na base de dados são desfeitas
             */
            transaction = await sequelize.transaction();

            //obtém via parâmetro o id da unidade a ser deletado
            const { id } = req.params;
            //atualiza as informações da unidade na base de dados atualizando as informações recebidas no formato JSON através da requisição
            const unityCollection = await UnityPersistence.updateUnity(id, {

                managerId: req.body.managerId,
                boardId: req.body.boardId,
                name: req.body.name, 
                latLon: req.body.latLon,
                updatedAt: formatDatabaseDatetime(new Date())
            }, { transaction });

            //se a unidade de fato existe
            if(unityCollection) {
                
                //envia como resposta as informações da unidade que foi alterado
                res.status(200).send(unityCollection);
            }
            else {

                //envia uma resposta indicando que a unidade não foi encontrado e o código 404
                sendErrorMessage(req, res, undefined, 'UNIDADES', 'ALTERAÇÃO DE UNIDADE', 404, 'warning', 'Unidade não encontrada');
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
            sendErrorMessage(req, res, error, 'UNIDADES', 'ALTERAÇÃO DE UNIDADE', 500, 'error', 'Falha ao alterar o cadastro da unidade, tente novamente mais tarde');
        }
    }

    /**
     * Método que implementa a requisição que delete uma unidade na base de dados
     * @param req objeto que contém as informações da requisição 
     * @param res objeto que contém as informações da resposta da requisição
     */
    async deleteUnity(req, res) {

        let transaction;

        try {

            /**
             * Cria uma transação, ela é importante pois se houver algum erro na operação, todas as manipulações feitas na base de dados são desfeitas
             */
            transaction = await sequelize.transaction();

            //obtém via parâmetro o id da unidade a ser deletado
            const { id } = req.params;
            //deleta a unidade na base de dados por meio de seu id
            const unityCollection = await UnityPersistence.deleteUnity(id, { transaction });

            //se a unidade realmente existe
            if(unityCollection) {

                //envia como resposta as informações da unidade deletado
                res.status(200).send(unityCollection);
            }
            //caso não tenha encontrado
            else {

                //envia uma resposta indicando que a unidade não foi encontrado e o código 404
                sendErrorMessage(req, res, undefined, 'UNIDADES', 'DELEÇÃO DE UNIDADE', 404, 'warning', 'Unidade não encontrada');
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
            sendErrorMessage(req, res, error, 'UNIDADES', 'DELEÇÃO DE UNIDADE', 500, 'error', 'Falha ao deletar o cadastro da unidade, tente novamente mais tarde');
        }
    }

    /**
     * Método que implementa a requisição que deleta todos as unidades na base de dados
     * PS: requisição não utilizada na API (feita apenas para testes)
     * @param req objeto que contém as informações da requisição 
     * @param res objeto que contém as informações da resposta da requisição
     */
    async deleteAllUnits(req, res) {

        let transaction;

        try {

            /**
             * Cria uma transação, ela é importante pois se houver algum erro na operação, todas as manipulações feitas na base de dados são desfeitas
             */
            transaction = await sequelize.transaction();
            
            //deleta todos as unidades na base de dados
            await UnityPersistence.deleteAllUnits({ transaction });

            //comita na base de dados as operações realizadas
            await transaction.commit();
            res.status(200).send("Todos as unidades foram deletados");
        }
        catch(error) {
            
            //se ocorreu algum erro
            if(transaction) {
                
                //desfaz quaisquer operações realizadas na base de dados
                await transaction.rollback();
            }

            //envia uma resposta indicando a falha que ocorreu durante o processo de deleção
            sendErrorMessage(req, res, error, 'UNIDADES', 'DELEÇÃO DE UNIDADES', 500, 'error', 'Falha ao deletar o cadastro de todas unidades, tente novamente mais tarde');
        }
    }

    /**
     * Método que implementa a requisição que cria um novo usuário na base de dados
     * @param req objeto que contém as informações da requisição 
     * @param res objeto que contém as informações da resposta da requisição
     */
    async countUnits(req, res) {

        try {
            //realiza a contagem das unidades
            const countUnits = await UnityPersistence.countUnits();
            
            //envia o total de unidades
            res.send(countUnits);
        }
        catch(error) {

            //em caso de falha envia uma resposta com o erro ocorrido
            sendErrorMessage(req, res, error, 'UNIDADES', 'CONTAGEM DE UNIDADES', 500, 'error', 'Falha ao obter os indicadores de unidades, tente novamente mais tarde');
        }
    }
}

module.exports = new UnityController();