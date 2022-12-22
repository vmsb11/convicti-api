const { sequelize } = require('../models');
const SellerPersistence = require('../persistence/sellerPersistence');
//importa as funções implementas para serem utilizadas nas operações abaixo
const { sendErrorMessage } = require('../helpers/api_helpers');
const { formatDatabaseDatetime } = require('../helpers/date_helpers');

/**
 * Classe responsável por tratar as requisições (como cadastros, alterações, remoções, consultas e etc) da API relacionadas a entidade Seller
 */
class SellerController {

    /**
     * Método que implementa a requisição que cria um novo vendedor na base de dados
     * @param req objeto que contém as informações da requisição 
     * @param res objeto que contém as informações da resposta da requisição
     */
    async createSeller(req, res) {

        let transaction;

        try {

            /**
             * Cria uma transação, ela é importante pois se houver algum erro na operação, todas as manipulações feitas na base de dados são desfeitas
             */
            transaction = await sequelize.transaction();
            
            //cria um novo vendedor na base de dados inserindo as informações recebidas no formato JSON através da requisição
            const newSeller = await SellerPersistence.createSeller({
                userId: req.body.userId,
                unityId: req.body.unityId,
                createdAt: formatDatabaseDatetime(new Date()),
                updatedAt: formatDatabaseDatetime(new Date())
            }, { transaction });

            //comita na base de dados as operações realizadas
            await transaction.commit();
            //envia a resposta indicando que o cadastro foi realizado junto com as informações do vendedor cadastrado
            res.status(201).send(newSeller);
        }
        catch(error) {
            
            //se ocorreu algum erro
            if(transaction) {
                
                //desfaz quaisquer operações realizadas na base de dados
                await transaction.rollback();
            }

            //envia uma resposta indicando o erro que ocorreu na operação de cadastro
            sendErrorMessage(req, res, error, 'VENDEDORES', 'CADASTRO DE VENDEDOR', 500, 'error', 'Falha ao gerar o cadastro do vendedor, tente novamente mais tarde');
        }
    }

    /**
     * Método que implementa a requisição que busca os vendedores na base de dados
     * PS: requisição não utilizada na API (feita apenas para testes)
     * @param req objeto que contém as informações da requisição 
     * @param res objeto que contém as informações da resposta da requisição
     */
    async searchSellers(req, res) {

        try {

            //obtém através dos parâmetros da requisição os filtros a serem utilizados na busca
            const { unityId, parameter, page, size } = req.query;
            //realiza a busca dos vendedores na base de dados
            const sellersCollection = await SellerPersistence.searchSellers(unityId, parameter, page, size);
            
            //envia como resposta os vendedores encontrados ou uma lista vazia
            res.status(200).send(sellersCollection);
        }
        catch(error) {
            
            //em caso de falha, envia uma mensagem de erro indicando a falha que ocorreu durante o processo de busca
            sendErrorMessage(req, res, error, 'VENDEDORES', 'PESQUISA DE VENDEDORES', 500, 'error', 'Falha ao pesquisar vendedores, tente novamente mais tarde');
        }
    }

    /**
     * Método que implementa a requisição que busca um vendedor por meio de seu id na base de dados
     * PS: requisição não utilizada na API (feita apenas para testes)
     * @param req objeto que contém as informações da requisição 
     * @param res objeto que contém as informações da resposta da requisição
     */
    async findSellerById(req, res) {

        try {

            //busca o vendedor na base de dados por meio do seu id recebido como parâmetro na requisição
            const sellerCollection = await SellerPersistence.findSellerById(req.params.id);

            //se encontrou o vendedor
            if(sellerCollection) {

                //envia como resposta o usuario encontrado
                res.status(200).send(sellerCollection);
            }
            else {

                //envia uma resposta indicando que o vendedor não foi encontrado e o código 404
                sendErrorMessage(req, res, undefined, 'VENDEDORES', 'PESQUISA DE VENDEDOR POR ID', 404, 'warning', 'Vendedor não encontrado');
            }
        }
        catch(error) {
            
            //em caso de falha, envia uma mensagem de erro indicando a falha que ocorreu durante o processo de busca
            sendErrorMessage(req, res, error, 'VENDEDORES', 'PESQUISA DE VENDEDOR POR ID', 500, 'error', 'Falha ao pesquisar o vendedor, tente novamente mais tarde');
        }
    }

    /**
     * Método que implementa a requisição que atualiza o cadastro do vendedor na base de dados
     * @param req objeto que contém as informações da requisição 
     * @param res objeto que contém as informações da resposta da requisição
     */
    async updateSeller(req, res) {

        let transaction;

        try {

             /**
             * Cria uma transação, ela é importante pois se houver algum erro na operação, todas as manipulações feitas na base de dados são desfeitas
             */
            transaction = await sequelize.transaction();

            //obtém via parâmetro o id do vendedor a ser atualizado
            const { id } = req.params;
            //atualiza as informações do vendedor na base de dados atualizando as informações recebidas no formato JSON através da requisição
            const sellerCollection = await SellerPersistence.updateSeller(id, {
                userId: req.body.userId,
                unityId: req.body.unityId,
                updatedAt: formatDatabaseDatetime(new Date())
            }, { transaction });

            //se o vendedor de fato existe
            if(sellerCollection) {
                
                //envia como resposta as informações do vendedor que foi alterado
                res.status(200).send(sellerCollection);
            }
            else {

                //envia uma resposta indicando que o vendedor não foi encontrado e o código 404
                sendErrorMessage(req, res, undefined, 'VENDEDORES', 'ALTERAÇÃO DE VENDEDOR', 404, 'warning', 'Vendedor não encontrado');
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
            sendErrorMessage(req, res, error, 'VENDEDORES', 'ALTERAÇÃO DE VENDEDOR', 500, 'error', 'Falha ao alterar o cadastro do vendedor, tente novamente mais tarde');
        }
    }

    /**
     * Método que implementa a requisição que delete um vendedor na base de dados
     * PS: requisição não utilizada na API (feita apenas para testes)
     * @param req objeto que contém as informações da requisição 
     * @param res objeto que contém as informações da resposta da requisição
     */
    async deleteSeller(req, res) {

        let transaction;

        try {

             /**
             * Cria uma transação, ela é importante pois se houver algum erro na operação, todas as manipulações feitas na base de dados são desfeitas
             */
            transaction = await sequelize.transaction();

            //obtém via parâmetro o id do vendedor a ser deletado
            const { id } = req.params;
            //deleta o vendedor na base de dados por meio de seu id
            const sellerCollection = await SellerPersistence.deleteSeller(id, { transaction });

            //se o vendedor realmente existe
            if(sellerCollection) {

                //envia como resposta as informações do vendedor deletado
                res.status(200).send(sellerCollection);
            }
            //caso não tenha encontrado
            else {

                //envia uma resposta indicando que o vendedor não foi encontrado e o código 404
                sendErrorMessage(req, res, undefined, 'VENDEDORES', 'DELEÇÃO DE VENDEDOR', 404, 'warning', 'Vendedor não encontrado');
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
            sendErrorMessage(req, res, error, 'VENDEDORES', 'DELEÇÃO DE VENDEDOR', 500, 'error', 'Falha ao deletar o seu cadastro, tente novamente mais tarde');
        }
    }

    /**
     * Método que implementa a requisição que deleta todos os vendedores na base de dados
     * PS: requisição não utilizada na API (feita apenas para testes)
     * @param req objeto que contém as informações da requisição 
     * @param res objeto que contém as informações da resposta da requisição
     */
    async deleteAllSellers(req, res) {

        let transaction;

        try {

             /**
             * Cria uma transação, ela é importante pois se houver algum erro na operação, todas as manipulações feitas na base de dados são desfeitas
             */
            transaction = await sequelize.transaction();

            //deleta todos os vendedores na base de dados
            await SellerPersistence.deleteAllSellers({ transaction });
            //comita na base de dados as operações realizadas
            await transaction.commit();

            res.status(200).send("Todos os vendedores foram deletados");
        }
        catch(error) {
            
            //se ocorreu algum erro
            if(transaction) {
                
                //desfaz quaisquer operações realizadas na base de dados
                await transaction.rollback();
            }

            //envia uma resposta indicando a falha que ocorreu durante o processo de deleção
            sendErrorMessage(req, res, error, 'VENDEDORES', 'DELEÇÃO DE VENDEDORES', 500, 'error', 'Falha ao deletar o cadastro de todos vendedores, tente novamente mais tarde');
        }
    }

    /**
     * Método que implementa a requisição que conta o total de vendedores cadastrados na base de dados
     * PS: requisição não utilizada na API (feita apenas para testes)
     * @param req objeto que contém as informações da requisição 
     * @param res objeto que contém as informações da resposta da requisição
     */
     async countSellers(req, res) {

        try {

            //realiza a contagem dos vendedores cadastrados
            const countSellers = await SellerPersistence.countSellers();

            //envia como resposta o total dos vendedores
            res.status(200).send(countSellers);
        }
        catch(error) {
            
            //em caso de erro, envia uma resposta indicando a falha que ocorreu
            sendErrorMessage(req, res, error, 'VENDEDORES', 'CONTAGEM DE VENDEDORES', 500, 'error', 'Falha ao processar a contagem de vendedores, tente novamente mais tarde');
        }
    }
}

module.exports = new SellerController();