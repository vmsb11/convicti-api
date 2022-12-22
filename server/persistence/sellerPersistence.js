const Sequelize = require('sequelize');
const Seller = require('../models').sellers;
const Unity = require('../models').units;
const User = require('../models').users;
const { getQueryFilter, getPagination, getPagingData } = require('../helpers/search_helpers');
const columns = [
    'sellerId',
    'userId',
    'unityId',
    'createdAt', 
    'updatedAt',
    '$unitySeller.name$',
    '$userSeller.name$',
    '$userSeller.mail$',
    '$userSeller.status$'
];
//variável que faz a associação da entidade usuário com o vendedor, permitindo assim trazer nos resultados das buscas dos vendedores as informações do diretor associado a cada seller
const userSeller = {
    model: User,
    as: 'userSeller'
};
//variável que faz a associação da entidade vendedor com o vendedor, permitindo assim trazer nos resultados das buscas dos vendedores as informações do diretor associado a cada seller
const unitySeller = {
    model: Unity,
    as: 'unitySeller'
};
//variável de instância da própria classe
let instance = null;

/**
 * Classe na qual são implementados os métodos que realizam a manipulação das informações da Entidade Seller como cadastrar, consultar, consulta por campos, editar, remover e etc
 */
class SellerPersistence {

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
     * Método utilizado para cadastrar um vendedor na base de dados
     * @param seller dados do vendedor a ser cadastrada 
     * @param transaction instância da transação que tá controlando a operação
     * @returns retorna um objeto com as informações do vendedor cadastrada
     */
    async createSeller(seller, transaction) {

        //cria o vendedor na base de dados
        const newSeller = await Seller.create(seller, transaction);
    
         //retorna o vendedor criado
        return newSeller;
    }

    /**
     * Método que realiza uma busca de todos os vendedores cadastrados
     * @param unityId id da unidade, se não for informada, lista todos os vendedores em geral
     * @param parameter parâmetro de busca, se o valor informado for "undefined", o filtro é ignorado
     * @param page página atual da busca
     * @param size total de registros por página
     * @returns uma lista dos vendedores cadastrados ou uma lista vazia caso não seja encontrado 
     */
    async searchSellers(unityId, parameter, page, size) {

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
        //inclui na busca as informações do diretor associado os vendedores enconttrados
        query.include = [userSeller, unitySeller];
        
        //se o id da unidade for informada
        if(unityId) {
            //filtra os vendedores pela unidade
            query.where = {...query.where, unityId: {
                [Op.and]: {[Op.eq]: unityId}
            }};
        }

        //se o parâmetro for informado
        if(parameter) {
            
            //monta o filtro de busca filtrando cada uma das colunas escolhidas com o parâmetro informado
            const searchFilter = getQueryFilter(columns, parameter);
            
            query.where = {...query.where, [Op.and]: searchFilter.where};
        }
        
        //faz a busca na base de dados com base nas configurações de busca realizadas com a paginação configurada
        const sellersCollection = await Seller.findAndCountAll(query);
        
        //retorna uma lista com as informações dos vendedores configurado por página
        return getPagingData(sellersCollection, page, limit);
    }

    /**
     * Método que realiza a busca do vendedor por meio do seu id
     * @param sellerId id do vendedor a ser buscado 
     * @returns retorna as informações do vendedor ou null caso não seja encontrado
     */
    async findSellerById(sellerId) {

        //realiza a busca do vendedor por meio do seu id e inclui no resultado da busca as informações do diretor associado a esso vendedor
        const sellerCollection = await Seller.findByPk(sellerId, { include: [userSeller, unitySeller] });

        //se encontrou retorna as informações da busca
        if(sellerCollection) {

            return sellerCollection;
        }
        
        //se não encontrou, retorna nulo
        return null;
    }

    /**
     * Método que realiza a busca do vendedor por meio de um filtro com base em uma lista de chaves (nome dos campos) e valores a serem utilizados para filtrar
     * Exemplo: filtrar por titulo e status então teremos uma lista de chaves do tipo
     * [
     *    {"field": "title", "value": "xxxxxxxxxx" },
     *    {"field": "status", "value": "yyy"}
     * ]
     * @param parameters lista com os campos e os valores a serem utilizados como filtro 
     * @returns retorna as informações do vendedor ou null caso não seja encontrado
     */
     async findSellerByParameters(parameters) {

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

        //faz a busca de um único vendedor com base no filtro montado e inclui no resultado da busca as informações do diretor associado a esso vendedor
        const sellerCollection = await Seller.findOne(query, { include: [userSeller, unitySeller] });
        
         //se encontrou retorna as informações da busca
         if(sellerCollection) {

            return sellerCollection;
        }
        
        //se não encontrou, retorna nulo
        return null;
    }

    /**
     * Método utilizado para alterar um vendedor na base de dados
     * @param sellerId id do vendedor a ser atualizado
     * @param seller dados do vendedor a ser alterado 
     * @param transaction instância da transação que tá controlando a operação
     * @returns retorna um objeto com as informações do vendedor alterado ou null se o vendedor não foi encontrado
     */
    async updateSeller(sellerId, seller, transaction) {

        //faz a busca do vendedor com base no id para verificar se o mesmo existe na base de dados
        const sellerCollection = await Seller.findByPk(sellerId, {include: [userSeller, unitySeller]});

        //se encontrou
        if(sellerCollection) {

            //atualiza as informações do vendedor com base nos dados informados como parâmetro
            await sellerCollection.update(seller, transaction);

            //retorna o vendedor com as informações atualizados
            return sellerCollection;
        }
        
        //se não encontrou retorna null
        return null;
    }

    /**
     * Método utilizado para remover um vendedor na base de dados
     * @param sellerId id do vendedor a ser atualizado
     * @param transaction instância da transação que tá controlando a operação
     * @returns retorna um objeto com as informações do vendedor removida ou null se o vendedor não foi encontrado
     */
    async deleteSeller(sellerId, transaction) {

        //faz a busca do vendedor com base no id para verificar se o mesmo existe na base de dados
        const sellerCollection = await Seller.findByPk(sellerId);

        //se encontrou
        if(sellerCollection) {

            //remove o cadastro do vendedor na base de dados
            await sellerCollection.destroy(transaction);

            //retorna o vendedor removida
            return sellerCollection;
        }
        
        //se não encontrou retorna null
        return null;
    }

     /**
     * Método que deleta todos os vendedores cadastrados na base de dados
     * @param transaction instância da transação que tá controlando a operação
     */
    async deleteAllSellers(transaction) {

        //deleta todos os vendedores na base de dados
        await Seller.destroy({
            where: {},
            truncate: false,
            transaction
        });
    }

    /**
     * Método que conta o total dos vendedores cadastrados na base de dados
     * @returns total dos vendedores cadastrados
     */
    async countSellers() {

        //faz a busca utilizando a função de agregação count para contar o total dos vendedores cadastrados
        const countSellers = await Seller.findAll({
            attributes: [
                [Sequelize.fn('count', Sequelize.col('sellerId')), 'countSellers']
            ]
        });

        //retorna o total dos vendedores
        return countSellers;
    }
}

//exporta uma instância já criada da classe para ser utilizada em outros arquivos
module.exports = new SellerPersistence();