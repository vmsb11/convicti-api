const Sequelize = require('sequelize');
const Sale = require('../models').sales;
const User = require('../models').users;
const Seller = require('../models').sellers;
const Board = require('../models').boards;
const Unity = require('../models').units;
const Manager = require('../models').managers;
const { getQueryFilter, getPagination, getPagingData } = require('../helpers/search_helpers');
const columns = [
    'saleId',
    'sellerId',
    'boardId',
    'unityId',
    'managerId',
    'date',
    'amount',
    'location',
    'status',
    'createdAt', 
    'updatedAt',
    '$sellerSale.userSeller.name$',
    '$sellerSale.userSeller.mail$',
    '$sellerSale.userSeller.status$',
    '$boardSale.name$',
    '$unitySale.name$'
];
//variável que faz a associação da entidade vendedor com a venda, permitindo assim trazer nos resultados das buscas das vendas as informações do diretor associado a cada sale
const sellerSale = {
    model: Seller,
    as: 'sellerSale',
    include: {
        model: User,
        as: 'userSeller'
    }
};
//variável que faz a associação da entidade diretoria com a venda, permitindo assim trazer nos resultados das buscas das vendas as informações do diretor associado a cada sale
const boardSale = {
    model: Board,
    as: 'boardSale'
};
//variável que faz a associação da entidade unidade com a venda, permitindo assim trazer nos resultados das buscas das vendas as informações do diretor associado a cada sale
const unitySale = {
    model: Unity,
    as: 'unitySale'
};
//variável que faz a associação da entidade gerente com a venda, permitindo assim trazer nos resultados das buscas das vendas as informações do diretor associado a cada sale
const managerSale = {
    model: Manager,
    as: 'managerSale',
    include: {
        model: User,
        as: 'userManager'
    }
};
//variável de instância da própria classe
let instance = null;

/**
 * Classe na qual são implementados os métodas que realizam a manipulação das informações da Entidade Sale como cadastrar, consultar, consulta por campos, editar, remover e etc
 */
class SalePersistence {

    /**
     * Construtor padrão
     */
    constructor() {

        /**
         * Inicializa a variável global que armazenará a instância de um objeto da própria classe
         */
        if(instance === null) {

            instance = this;
        }
    }

    /**
     * Método utilizado para cadastrar uma venda na base de dados
     * @param sale dados da venda a ser cadastrada 
     * @param transaction instância da transação que tá controlando a operação
     * @returns retorna um objeto com as informações da venda cadastrada
     */
    async createSale(sale, transaction) {

        //cria a venda na base de dados
        const newSale = await Sale.create(sale, transaction);
    
         //retorna a venda criado
        return newSale;
    }

    /**
     * Método que realiza uma busca de todas as vendas cadastrados
     * @param sellerId id do vendedor, se não for informado, desconsidera esse filtro
     * @param boardId id da diretoria, se não for informado, desconsidera esse filtro
     * @param unityId id da unidade, se não for informada, desconsidera esse filtro
     * @param managerId id do gerente, se não for informada, desconsidera esse filtro
     * @param startDate data inicial, se não for informado, o filtro por data é ignorado
     * @param finalDate data final, se não for infomrado, o filtro por data é ignorado
     * @param parameter parâmetro de busca, se o valor informado for "undefined", o filtro é ignorado
     * @param page página atual da busca
     * @param size total de registros por página
     * @returns uma lista das vendas cadastrados ou uma lista vazia caso não seja encontrado 
     */
    async searchSales(sellerId, boardId, unityId, managerId, startDate, finalDate, parameter, page, size) {

        //configura a paginação e o total de registro por páginas e o offset (local de onde parte a busca)
        const { limit, offset } = getPagination(page - 1, size);
        //variável que armazena as configurações da busca
        const query = {};
        //armazena o operador de busca que pode ser AND ou OR
        const Op = Sequelize.Op;
        
        //configura a busca definindo o limite de registros a ser buscado e o offset de busca (necessário por a busca utilizar paginação)
        query.limit = limit;
        query.offset = offset;
        query.subQuery = false;
        query.distinct = true;
        query.duplicating = false;
        //inclui na busca as informações do diretor associado as vendas enconttrados
        query.include = [sellerSale, boardSale, unitySale, managerSale];
        
        //se o id do vendedor for informado
        if(sellerId) {
            //filtra as vendas pela unidade
            query.where = {...query.where, sellerId: {
                [Op.and]: {[Op.eq]: sellerId}
            }};
        }

        //se o id da diretoria for informada
        if(boardId) {
            //filtra as vendas pela unidade
            query.where = {...query.where, boardId: {
                [Op.and]: {[Op.eq]: boardId}
            }};
        }

        //se o id da unidade for informada
        if(unityId) {
            //filtra as vendas pela unidade
            query.where = {...query.where, unityId: {
                [Op.and]: {[Op.eq]: unityId}
            }};
        }

        //se o id do gerente for informado
        if(managerId) {
            //filtra as vendas pela unidade
            query.where = {...query.where, managerId: {
                [Op.and]: {[Op.eq]: managerId}
            }};
        }

        //se a data inicial e final forem informadas, filtra por período de data
        if(startDate && finalDate) {

            query.where = {...query.where, [Op.and]: [
                Sequelize.where(Sequelize.col('date'), {
                    [Op.between]: [startDate, finalDate]
                }) 
            ]};
        }

        //se o parâmetro for informado
        if(parameter) {
            
            //monta o filtro de busca filtrando cada uma das colunas escolhidas com o parâmetro informado
            const searchFilter = getQueryFilter(columns, parameter);
            
            query.where = {...query.where, [Op.and]: searchFilter.where};
        }

        //ordena na ordem descendente
        query.order = [
            [Sequelize.col('date'), 'DESC']
        ];
        
        //faz a busca na base de dados com base nas configurações de busca realizadas com a paginação configurada
        const salesCollection = await Sale.findAndCountAll(query);
        
        //retorna uma lista com as informações das vendas configurado por página
        return getPagingData(salesCollection, page, limit);
    }

    /**
     * Método que realiza a busca da venda por meio do seu id
     * @param saleId id da venda a ser buscado 
     * @returns retorna as informações da venda ou null caso não seja encontrado
     */
    async findSaleById(saleId) {

        //realiza a busca da venda por meio do seu id e inclui no resultado da busca as informações do diretor associado a essa venda
        const saleCollection = await Sale.findByPk(saleId, { include: [sellerSale, boardSale, unitySale, managerSale] });

        //se encontrou retorna as informações da busca
        if(saleCollection) {

            return saleCollection;
        }
        
        //se não encontrou, retorna nulo
        return null;
    }

    /**
     * Método que realiza a busca da venda por meio de um filtro com base em uma lista de chaves (nome dos campos) e valores a serem utilizados para filtrar
     * Exemplo: filtrar por titulo e status então teremos uma lista de chaves do tipo
     * [
     *    {"field": "title", "value": "xxxxxxxxxx" },
     *    {"field": "status", "value": "yyy"}
     * ]
     * @param parameters lista com os campos e os valores a serem utilizados como filtro 
     * @returns retorna as informações da venda ou null caso não seja encontrado
     */
     async findSaleByParameters(parameters) {

        //variável que armazena o filtro de busca utilizando a cláusula where
        const query = {where:{}};
        const Op = Sequelize.Op;

        //percorre a lista de parametros
        for(let i = 0; i < parameters.length; i++) {

            //obtém o parametro atual.
            const parameter = parameters[i];

            //monta a cláusula Where com o nome do campo e o valor a ser buscado, o operador utilizado é sempre o AND para combinar quando houver mais de uma condição
            query.where = {...query.where, [parameter.field]: {
                [Op.and]: {[Op.eq]: parameter.value}
            }};
        }

        //faz a busca de um única venda com base no filtro montado e inclui no resultado da busca as informações do diretor associado a essa venda
        const saleCollection = await Sale.findOne(query, { include: [sellerSale, boardSale, unitySale, managerSale] });
        
         //se encontrou retorna as informações da busca
         if(saleCollection) {

            return saleCollection;
        }
        
        //se não encontrou, retorna nulo
        return null;
    }

    /**
     * Método utilizado para alterar uma venda na base de dados
     * @param saleId id da venda a ser atualizada
     * @param sale dados da venda a ser alterado 
     * @param transaction instância da transação que tá controlando a operação
     * @returns retorna um objeto com as informações da venda alterado ou null se a venda não foi encontrado
     */
    async updateSale(saleId, sale, transaction) {

        //faz a busca da venda com base no id para verificar se o mesmo existe na base de dados
        const saleCollection = await Sale.findByPk(saleId, {include: [sellerSale, boardSale, unitySale, managerSale]});

        //se encontrou
        if(saleCollection) {

            //atualiza as informações da venda com base nos dados informados como parâmetro
            await saleCollection.update(sale, transaction);

            //retorna a venda com as informações atualizadas
            return saleCollection;
        }
        
        //se não encontrou retorna null
        return null;
    }

    /**
     * Método utilizado para remover uma venda na base de dados
     * @param saleId id da venda a ser atualizada
     * @param transaction instância da transação que tá controlando a operação
     * @returns retorna um objeto com as informações da venda removida ou null se a venda não foi encontrado
     */
    async deleteSale(saleId, transaction) {

        //faz a busca da venda com base no id para verificar se o mesmo existe na base de dados
        const saleCollection = await Sale.findByPk(saleId);

        //se encontrou
        if(saleCollection) {

            //remove o cadastro da venda na base de dados
            await saleCollection.destroy(transaction);

            //retorna a venda removida
            return saleCollection;
        }
        
        //se não encontrou retorna null
        return null;
    }

     /**
     * Método que deleta todas as vendas cadastrados na base de dados
     * @param transaction instância da transação que tá controlando a operação
     */
    async deleteAllSales(transaction) {

        //deleta todas as vendas na base de dados
        await Sale.destroy({
            where: {},
            truncate: false,
            transaction
        });
    }

    /**
     * Método que conta o total das vendas cadastrados na base de dados
     * @returns total das vendas cadastrados
     */
    async countSales() {

        //faz a busca utilizando a função de agregação count para contar o total das vendas cadastrados
        const countSales = await Sale.findAll({
            attributes: [
                [Sequelize.fn('count', Sequelize.col('saleId')), 'countSales']
            ]
        });

        //retorna o total das vendas
        return countSales;
    }
}

//exporta uma instância já criada da classe para ser utilizada em outros arquivos
module.exports = new SalePersistence();