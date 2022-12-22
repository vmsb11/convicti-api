const Sequelize = require('sequelize');
const Unity = require('../models').units;
const Director = require('../models').directors;
const Board = require('../models').boards;
const Manager = require('../models').managers;
const User = require('../models').users;
const { getQueryFilter, getPagination, getPagingData } = require('../helpers/search_helpers');
const columns = [
    'unityId',
    'managerId',
    'boardId',
    'name',
    'latLon',
    'createdAt', 
    'updatedAt',
    '$managerUnity.userManager.name$',
    '$managerUnity.userManager.mail$',
    '$managerUnity.userManager.status$',
    '$boardUnity.name$'
];
//variável que faz a associação da entidade gerente com a unidade, permitindo assim trazer nos resultados das buscas das unidades as informações do diretor associado a cada unity
const managerUnity = {
    model: Manager,
    as: 'managerUnity',
    include: {
        model: User,
        as: 'userManager'
    }
};
//variável que faz a associação da entidade unidade com a unidade, permitindo assim trazer nos resultados das buscas das unidades as informações do diretor associado a cada unity
const boardUnity = {
    model: Board,
    as: 'boardUnity'
};
//variável de instância da própria classe
let instance = null;

/**
 * Classe na qual são implementados os métodos que realizam a manipulação das informações da Entidade Unity como cadastrar, consultar, consulta por campos, editar, remover e etc
 */
class UnityPersistence {

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
     * Método utilizado para cadastrar uma unidade na base de dados
     * @param unity dados da unidade a ser cadastrada 
     * @param transaction instância da transação que tá controlando a operação
     * @returns retorna um objeto com as informações da unidade cadastrada
     */
    async createUnity(unity, transaction) {

        //cria a unidade na base de dados
        const newUnity = await Unity.create(unity, transaction);
    
         //retorna a unidade criado
        return newUnity;
    }

    /**
     * Método que realiza uma busca de todos as unidades cadastradas
     * @param boardId id da diretoria, se for informado undefined, o filtro é ignorado
     * @param parameter parâmetro de busca, se o valor informado for "undefined", o filtro é ignorado
     * @param page página atual da busca
     * @param size total de registros por página
     * @returns uma lista das unidades cadastradas ou uma lista vazia caso não seja encontrada 
     */
    async searchUnits(boardId, parameter, page, size) {

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
        //inclui na busca as informações do diretor associado as unidades enconttrados
        query.include = [managerUnity, boardUnity];
        
        //se o id da diretoria for informada
        if(boardId) {
            //filtra as vendas pela unidade
            query.where = {...query.where, boardId: {
                [Op.and]: {[Op.eq]: boardId}
            }};
        }

        //se o parâmetro for informado
        if(parameter) {
            
            //monta o filtro de busca filtrando cada uma das colunas escolhidas com o parâmetro informado
            const searchFilter = getQueryFilter(columns, parameter);
            
            query.where = {...query.where, [Op.and]: searchFilter.where};
        }
        
        //faz a busca na base de dados com base nas configurações de busca realizadas com a paginação configurada
        const unitsCollection = await Unity.findAndCountAll(query);
        
        //retorna uma lista com as informações das unidades configurado por página
        return getPagingData(unitsCollection, page, limit);
    }

    /**
     * Método que realiza a busca da unidade por meio do seu id
     * @param unityId id da unidade a ser buscado 
     * @returns retorna as informações da unidade ou null caso não seja encontrada
     */
    async findUnityById(unityId) {

        //realiza a busca da unidade por meio do seu id e inclui no resultado da busca as informações do diretor associado a essa unidade
        const unityCollection = await Unity.findByPk(unityId, { include: [managerUnity, boardUnity] });

        //se encontrou retorna as informações da busca
        if(unityCollection) {

            return unityCollection;
        }
        
        //se não encontrou, retorna nulo
        return null;
    }

    /**
     * Método que realiza a busca da unidade por meio de um filtro com base em uma lista de chaves (nome dos campos) e valores a serem utilizados para filtrar
     * Exemplo: filtrar por titulo e status então teremos uma lista de chaves do tipo
     * [
     *    {"field": "title", "value": "xxxxxxxxxx" },
     *    {"field": "status", "value": "yyy"}
     * ]
     * @param parameters lista com os campos e os valores a serem utilizados como filtro 
     * @returns retorna as informações da unidade ou null caso não seja encontrada
     */
     async findUnityByParameters(parameters) {

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

        //faz a busca de um única unidade com base no filtro montado e inclui no resultado da busca as informações do diretor associado a essa unidade
        const unityCollection = await Unity.findOne(query, { include: [managerUnity, boardUnity] });
        
         //se encontrou retorna as informações da busca
         if(unityCollection) {

            return unityCollection;
        }
        
        //se não encontrou, retorna nulo
        return null;
    }

    /**
     * Método utilizado para alterar uma unidade na base de dados
     * @param unityId id da unidade a ser atualizada
     * @param unity dados da unidade a ser alterado 
     * @param transaction instância da transação que tá controlando a operação
     * @returns retorna um objeto com as informações da unidade alterado ou null se a unidade não foi encontrada
     */
    async updateUnity(unityId, unity, transaction) {

        //faz a busca da unidade com base no id para verificar se o mesmo existe na base de dados
        const unityCollection = await Unity.findByPk(unityId, {include: [managerUnity, boardUnity]});

        //se encontrou
        if(unityCollection) {

            //atualiza as informações da unidade com base nos dados informados como parâmetro
            await unityCollection.update(unity, transaction);

            //retorna a unidade com as informações atualizadas
            return unityCollection;
        }
        
        //se não encontrou retorna null
        return null;
    }

    /**
     * Método utilizado para remover uma unidade na base de dados
     * @param unityId id da unidade a ser atualizada
     * @param transaction instância da transação que tá controlando a operação
     * @returns retorna um objeto com as informações da unidade removida ou null se a unidade não foi encontrada
     */
    async deleteUnity(unityId, transaction) {

        //faz a busca da unidade com base no id para verificar se o mesmo existe na base de dados
        const unityCollection = await Unity.findByPk(unityId);

        //se encontrou
        if(unityCollection) {

            //remove o cadastro da unidade na base de dados
            await unityCollection.destroy(transaction);

            //retorna a unidade removida
            return unityCollection;
        }
        
        //se não encontrou retorna null
        return null;
    }

     /**
     * Método que deleta todos as unidades cadastradas na base de dados
     * @param transaction instância da transação que tá controlando a operação
     */
    async deleteAllUnits(transaction) {

        //deleta todos as unidades na base de dados
        await Unity.destroy({
            where: {},
            truncate: false,
            transaction
        });
    }

    /**
     * Método que conta o total das unidades cadastradas na base de dados
     * @returns total da unidades cadastradas
     */
    async countUnits() {

        //faz a busca utilizando a função de agregação count para contar o total das unidades cadastradas
        const countUnits = await Unity.findAll({
            attributes: [
                [Sequelize.fn('count', Sequelize.col('unityId')), 'countUnits']
            ]
        });

        //retorna o total das unidades
        return countUnits;
    }
}

//exporta uma instância já criada da classe para ser utilizada em outros arquivos
module.exports = new UnityPersistence();