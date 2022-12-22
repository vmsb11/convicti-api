const Sequelize = require('sequelize');
const Manager = require('../models').managers;
const User = require('../models').users;
const { getQueryFilter, getPagination, getPagingData } = require('../helpers/search_helpers');
const columns = [
    'managerId',
    'userId',
    'createdAt', 
    'updatedAt',
    '$userManager.name$',
    '$userManager.mail$',
    '$userManager.status$'
];
//variável que faz a associação da entidade usuário com o gerente, permitindo assim trazer nos resultados das buscas dos gerentes as informações do usuário associado a cada manager
const userManager = {
    model: User,
    as: 'userManager'
};
//variável de instância da própria classe
let instance = null;

/**
 * Classe na qual são implementados os métodos que realizam a manipulação das informações da Entidade Manager como cadastrar, consultar, consulta por campos, editar, remover e etc
 */
class ManagerPersistence {

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
     * Método utilizado para cadastrar um gerente na base de dados
     * @param manager dados do gerente a ser cadastrado 
     * @param transaction instância da transação que tá controlando a operação
     * @returns retorna um objeto com as informações do gerente cadastrado
     */
    async createManager(manager, transaction) {

        //cria o gerente na base de dados
        const newManager = await Manager.create(manager, transaction);
    
         //retorna o gerente criado
        return newManager;
    }

    /**
     * Método que realiza uma busca de todos os gerentes cadastrados
     * @param parameter parâmetro de busca, se o valor informado for "undefined", o filtro é ignorado
     * @param page página atual da busca
     * @param size total de registros por página
     * @returns uma lista do gerentes cadastrados ou uma lista vazia caso não seja encontrado 
     */
    async searchManagers(parameter, page, size) {

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
        //inclui na busca as informações do usuário associado aos gerentes enconttrados
        query.include = [userManager];
        
        //se o parâmetro for informado
        if(parameter) {
            
            //monta o filtro de busca filtrando cada uma das colunas escolhidas com o parâmetro informado
            const searchFilter = getQueryFilter(columns, parameter);
            
            query.where = {...query.where, [Op.and]: searchFilter.where};
        }
        
        //faz a busca na base de dados com base nas configurações de busca realizadas com a paginação configurada
        const managersCollection = await Manager.findAndCountAll(query);
        
        //retorna uma lista com as informações dos gerentes configurado por página
        return getPagingData(managersCollection, page, limit);
    }

    /**
     * Método que realiza a busca do gerente por meio do seu id
     * @param managerId id do gerente a ser buscado 
     * @returns retorna as informações do gerente ou null caso não seja encontrado
     */
    async findManagerById(managerId) {

        //realiza a busca do gerente por meio do seu id e inclui no resultado da busca as informações do usuário associado a esso gerente
        const managerCollection = await Manager.findByPk(managerId, { include: [userManager] });

        //se encontrou retorna as informações da busca
        if(managerCollection) {

            return managerCollection;
        }
        
        //se não encontrou, retorna nulo
        return null;
    }

    /**
     * Método que realiza a busca do gerente por meio de um filtro com base em uma lista de chaves (nome dos campos) e valores a serem utilizados para filtrar
     * Exemplo: filtrar por titulo e status então teremos uma lista de chaves do tipo
     * [
     *    {"field": "title", "value": "xxxxxxxxxx" },
     *    {"field": "status", "value": "yyy"}
     * ]
     * @param parameters lista com os campos e os valores a serem utilizados como filtro 
     * @returns retorna as informações do gerente ou null caso não seja encontrado
     */
     async findManagerByParameters(parameters) {

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

        //faz a busca de um único gerente com base no filtro montado e inclui no resultado da busca as informações do usuário associado a esso gerente
        const managerCollection = await Manager.findOne(query, { include: [userManager] });
        
         //se encontrou retorna as informações da busca
         if(managerCollection) {

            return managerCollection;
        }
        
        //se não encontrou, retorna nulo
        return null;
    }

    /**
     * Método utilizado para alterar um gerente na base de dados
     * @param managerId id do gerente a ser atualizado
     * @param manager dados do gerente a ser alterado 
     * @param transaction instância da transação que tá controlando a operação
     * @returns retorna um objeto com as informações do gerente alterado ou null se o gerente não foi encontrado
     */
    async updateManager(managerId, manager, transaction) {

        //faz a busca do gerente com base no id para verificar se o mesmo existe na base de dados
        const managerCollection = await Manager.findByPk(managerId, {include: [userManager]});

        //se encontrou
        if(managerCollection) {

            //atualiza as informações do gerente com base nos dados informados como parâmetro
            await managerCollection.update(manager, transaction);

            //retorna o gerente com as informações atualizadas
            return managerCollection;
        }
        
        //se não encontrou retorna null
        return null;
    }

    /**
     * Método utilizado para remover um gerente na base de dados
     * @param managerId id do gerente a ser atualizado
     * @param transaction instância da transação que tá controlando a operação
     * @returns retorna um objeto com as informações do gerente removido ou null se o gerente não foi encontrado
     */
    async deleteManager(managerId, transaction) {

        //faz a busca do gerente com base no id para verificar se o mesmo existe na base de dados
        const managerCollection = await Manager.findByPk(managerId);

        //se encontrou
        if(managerCollection) {

            //remove o cadastro do gerente na base de dados
            await managerCollection.destroy(transaction);

            //retorna o gerente removido
            return managerCollection;
        }
        
        //se não encontrou retorna null
        return null;
    }

     /**
     * Método que deleta todos os gerentes cadastrados na base de dados
     * @param transaction instância da transação que tá controlando a operação
     */
    async deleteAllManagers(transaction) {

        //deleta todos os gerentes na base de dados
        await Manager.destroy({
            where: {},
            truncate: false,
            transaction
        });
    }

    /**
     * Método que conta o total do gerentes cadastrados na base de dados
     * @returns total do gerentes cadastrados
     */
    async countManagers() {

        //faz a busca utilizando a função de agregação count para contar o total do gerentes cadastrados
        const countManagers = await Manager.findAll({
            attributes: [
                [Sequelize.fn('count', Sequelize.col('managerId')), 'countManagers']
            ]
        });

        //retorna o total do gerentes
        return countManagers;
    }
}

//exporta uma instância já criada da classe para ser utilizada em outros arquivos
module.exports = new ManagerPersistence();