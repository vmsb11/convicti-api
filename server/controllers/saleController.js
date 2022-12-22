const { sequelize } = require('../models');
const SalePersistence = require('../persistence/salePersistence');
//importa as funções implementas para serem utilizadas nas operações abaixo
const { sendErrorMessage } = require('../helpers/api_helpers');
const { formatDatabaseDatetime } = require('../helpers/date_helpers');

/**
 * Classe responsável por tratar as requisições (como cadastros, alterações, remoções, consultas e etc) da API relacionadas a entidade Sale
 */
class SaleController {

    /**
     * Método que implementa a requisição que cria um nova venda na base de dados
     * @param req objeto que contém as informações da requisição 
     * @param res objeto que contém as informações da resposta da requisição
     */
    async createSale(req, res) {

        let transaction;

        try {
            
            /**
             * Cria uma transação, ela é importante pois se houver algum erro na operação, todas as manipulações feitas na base de dados são desfeitas
             */
            transaction = await sequelize.transaction();

            //cria um nova venda na base de dados inserindo as informações recebidas no formato JSON através da requisição
            const newSale = await SalePersistence.createSale({
                sellerId: req.body.sellerId,
                boardId: req.body.boardId,
                unityId: req.body.unityId,
                date: req.body.date,
                amount: req.body.amount,
                location: req.body.location,
                status: req.body.status,
                createdAt: formatDatabaseDatetime(new Date()),
                updatedAt: formatDatabaseDatetime(new Date())
            }, { transaction });
            
            //comita na base de dados as operações realizadas
            await transaction.commit();
            //envia a resposta indicando que o cadastro foi realizado junto com as informações da venda cadastrado
            res.status(201).send(newSale);
        }
        catch(error) {
            
            //se ocorreu algum erro
            if(transaction) {
                    
                //desfaz quaisquer operações realizadas na base de dados
                await transaction.rollback();
            }

            //envia uma resposta indicando o erro que ocorreu na operação de cadastro
            sendErrorMessage(req, res, error, 'VENDAS', 'CADASTRO DE VENDA', 500, 'error', 'Falha ao gerar o cadastro da venda, tente novamente mais tarde');
        }
    }

    /**
     * Método que implementa a requisição que busca vendas na base de dados
     * @param req objeto que contém as informações da requisição 
     * @param res objeto que contém as informações da resposta da requisição
     */
    async searchSales(req, res) {

        try {
            //obtém através dos parâmetros da requisição os filtros a serem utilizados na busca
            const { sellerId, boardId, unityId, managerId, startDate, finalDate, parameter, page, size } = req.query;
            //realiza a busca das vendas TO-DO na base de dados
            const salesCollection = await SalePersistence.searchSales(sellerId, boardId, unityId, managerId, startDate, finalDate, parameter, page, size);
            
            //envia como resposta as vendas encontrados ou uma lista vazia
            res.status(200).send(salesCollection);
        }
        catch(error) {
            
            //em caso de falha, envia uma mensagem de erro indicando a falha que ocorreu durante o processo de busca
            sendErrorMessage(req, res, error, 'VENDAS', 'PESQUISA DE VENDAS', 500, 'error', 'Falha ao pesquisar sales, tente novamente mais tarde');
        }
    }

    /**
     * Método que implementa a requisição que busca uma venda por meio de seu id na base de dados
     * PS: requisição não utilizada na API (feita apenas para testes)
     * @param req objeto que contém as informações da requisição 
     * @param res objeto que contém as informações da resposta da requisição
     */
    async findSaleById(req, res) {

        try {

            //busca a venda na base de dados por meio do seu id recebido como parâmetro na requisição
            const saleCollection = await SalePersistence.findSaleById(req.params.id);

            //se encontrou a venda
            if(saleCollection) {

                //envia como resposta a venda encontrado
                res.status(200).send(saleCollection);
            }
            else {

                //envia uma resposta indicando que a venda não foi encontrado e o código 404
                sendErrorMessage(req, res, undefined, 'VENDAS', 'PESQUISA DE VENDA POR ID', 404, 'warning', 'Sale não encontrado');
            }
        }
        catch(error) {
            
            //em caso de falha, envia uma mensagem de erro indicando a falha que ocorreu durante o processo de busca
            sendErrorMessage(req, res, error, 'VENDAS', 'PESQUISA DE VENDA POR ID', 500, 'error', 'Falha ao pesquisar a venda, tente novamente mais tarde');
        }
    }

    /**
     * Método que implementa a requisição que atualiza o cadastro de uma venda na base de dados
     * @param req objeto que contém as informações da requisição 
     * @param res objeto que contém as informações da resposta da requisição
     */
    async updateSale(req, res) {

        let transaction;

        try {

            /**
             * Cria uma transação, ela é importante pois se houver algum erro na operação, todas as manipulações feitas na base de dados são desfeitas
             */
            transaction = await sequelize.transaction();

            //obtém via parâmetro o id da venda a ser deletado
            const { id } = req.params;
            //atualiza as informações da venda na base de dados atualizando as informações recebidas no formato JSON através da requisição
            const saleCollection = await SalePersistence.updateSale(id, {

                sellerId: req.body.sellerId,
                boardId: req.body.boardId,
                unityId: req.body.unityId,
                date: req.body.date,
                amount: req.body.amount,
                location: req.body.location,
                status: req.body.status,
                updatedAt: formatDatabaseDatetime(new Date())
            }, { transaction });

            //se a venda de fato existe
            if(saleCollection) {
                
                //envia como resposta as informações da venda que foi alterado
                res.status(200).send(saleCollection);
            }
            else {

                //envia uma resposta indicando que a venda não foi encontrado e o código 404
                sendErrorMessage(req, res, undefined, 'VENDAS', 'ALTERAÇÃO DE VENDA', 404, 'warning', 'Sale não encontrado');
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
            sendErrorMessage(req, res, error, 'VENDAS', 'ALTERAÇÃO DE VENDA', 500, 'error', 'Falha ao alterar o cadastro da venda, tente novamente mais tarde');
        }
    }

    /**
     * Método que implementa a requisição que delete uma venda na base de dados
     * @param req objeto que contém as informações da requisição 
     * @param res objeto que contém as informações da resposta da requisição
     */
    async deleteSale(req, res) {

        let transaction;

        try {

            /**
             * Cria uma transação, ela é importante pois se houver algum erro na operação, todas as manipulações feitas na base de dados são desfeitas
             */
            transaction = await sequelize.transaction();

            //obtém via parâmetro o id da venda a ser deletado
            const { id } = req.params;
            //deleta a venda na base de dados por meio de seu id
            const saleCollection = await SalePersistence.deleteSale(id, { transaction });

            //se a venda realmente existe
            if(saleCollection) {

                //envia como resposta as informações da venda deletado
                res.status(200).send(saleCollection);
            }
            //caso não tenha encontrado
            else {

                //envia uma resposta indicando que a venda não foi encontrado e o código 404
                sendErrorMessage(req, res, undefined, 'VENDAS', 'DELEÇÃO DE VENDA', 404, 'warning', 'Sale não encontrado');
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
            sendErrorMessage(req, res, error, 'VENDAS', 'DELEÇÃO DE VENDA', 500, 'error', 'Falha ao deletar o cadastro da venda, tente novamente mais tarde');
        }
    }

    /**
     * Método que implementa a requisição que deleta todas as vendas na base de dados
     * PS: requisição não utilizada na API (feita apenas para testes)
     * @param req objeto que contém as informações da requisição 
     * @param res objeto que contém as informações da resposta da requisição
     */
    async deleteAllSales(req, res) {

        let transaction;

        try {

            /**
             * Cria uma transação, ela é importante pois se houver algum erro na operação, todas as manipulações feitas na base de dados são desfeitas
             */
            transaction = await sequelize.transaction();
            
            //deleta todas as vendas na base de dados
            await SalePersistence.deleteAllSales({ transaction });

            //comita na base de dados as operações realizadas
            await transaction.commit();
            res.status(200).send("Todas as vendas foram deletados");
        }
        catch(error) {
            
            //se ocorreu algum erro
            if(transaction) {
                
                //desfaz quaisquer operações realizadas na base de dados
                await transaction.rollback();
            }

            //envia uma resposta indicando a falha que ocorreu durante o processo de deleção
            sendErrorMessage(req, res, error, 'VENDAS', 'DELEÇÃO DE VENDAS', 500, 'error', 'Falha ao deletar o cadastro de todas vendas, tente novamente mais tarde');
        }
    }

    /**
     * Método que implementa a requisição que conta o total de vendas
     * @param req objeto que contém as informações da requisição 
     * @param res objeto que contém as informações da resposta da requisição
     */
    async countSales(req, res) {

        try {
            //realiza a contagem das vendas agrupando por status
            const countSales = await SalePersistence.countSales();
            
            //envia o total de vendas
            res.send(countSales);
        }
        catch(error) {

            //em caso de falha envia uma resposta com o erro ocorrido
            sendErrorMessage(req, res, error, 'VENDAS', 'CONTAGEM DE VENDAS', 500, 'error', 'Falha ao obter os indicadores de vendas, tente novamente mais tarde');
        }
    }
}

module.exports = new SaleController();