const Sequelize = require('sequelize');
const Director = require('../models').directors;
const User = require('../models').users;
const { getQueryFilter, getPagination, getPagingData } = require('../helpers/search_helpers');
const columns = [
    'directorId',
    'userId',
    'generalManager',
    'createdAt', 
    'updatedAt',
    '$userDirector.name$',
    '$userDirector.mail$',
    '$userDirector.status$'
];
//variável que faz a associação da entidade usuário com o diretor, permitindo assim trazer nos resultados das buscas dos diretores as informações do usuário associado a cada director
const userDirector = {
    model: User,
    as: 'userDirector'
};
//variável de instância da própria classe
let instance = null;

/**
 * Classe na qual são implementados os métodos que realizam a manipulação das informações da Entidade Director como cadastrar, consultar, consulta por campos, editar, remover e etc
 */
class DirectorPersistence {

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
     * Método utilizado para cadastrar um diretor na base de dados
     * @param director dados do diretor a ser cadastrado 
     * @param transaction instância da transação que tá controlando a operação
     * @returns retorna um objeto com as informações do diretor cadastrado
     */
    async createDirector(director, transaction) {

        //cria o diretor na base de dados
        const newDirector = await Director.create(director, transaction);
    
         //retorna o diretor criado
        return newDirector;
    }

    /**
     * Método que realiza uma busca de todos os diretores cadastrados
     * @param parameter parâmetro de busca, se o valor informado for "undefined", o filtro é ignorado
     * @param page página atual da busca
     * @param size total de registros por página
     * @returns uma lista do diretores cadastrados ou uma lista vazia caso não seja encontrado 
     */
    async searchDirectors(parameter, page, size) {

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
        //inclui na busca as informações do usuário associado aos diretores enconttrados
        query.include = [userDirector];
        
        //se o parâmetro for informado
        if(parameter) {
            
            //monta o filtro de busca filtrando cada uma das colunas escolhidas com o parâmetro informado
            const searchFilter = getQueryFilter(columns, parameter);
            
            query.where = {...query.where, [Op.and]: searchFilter.where};
        }
        
        //faz a busca na base de dados com base nas configurações de busca realizadas com a paginação configurada
        const directorsCollection = await Director.findAndCountAll(query);
        
        //retorna uma lista com as informações dos diretores configurado por página
        return getPagingData(directorsCollection, page, limit);
    }

    /**
     * Método que realiza a busca do diretor por meio do seu id
     * @param directorId id do diretor a ser buscado 
     * @returns retorna as informações do diretor ou null caso não seja encontrado
     */
    async findDirectorById(directorId) {

        //realiza a busca do diretor por meio do seu id e inclui no resultado da busca as informações do usuário associado a esso diretor
        const directorCollection = await Director.findByPk(directorId, { include: [userDirector] });

        //se encontrou retorna as informações da busca
        if(directorCollection) {

            return directorCollection;
        }
        
        //se não encontrou, retorna nulo
        return null;
    }

    /**
     * Método que realiza a busca do diretor por meio de um filtro com base em uma lista de chaves (nome dos campos) e valores a serem utilizados para filtrar
     * Exemplo: filtrar por titulo e status então teremos uma lista de chaves do tipo
     * [
     *    {"field": "title", "value": "xxxxxxxxxx" },
     *    {"field": "status", "value": "yyy"}
     * ]
     * @param parameters lista com os campos e os valores a serem utilizados como filtro 
     * @returns retorna as informações do diretor ou null caso não seja encontrado
     */
     async findDirectorByParameters(parameters) {

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

        //faz a busca de um único diretor com base no filtro montado e inclui no resultado da busca as informações do usuário associado a esso diretor
        const directorCollection = await Director.findOne(query, { include: [userDirector] });
        
         //se encontrou retorna as informações da busca
         if(directorCollection) {
            
            return directorCollection;
        }
        
        //se não encontrou, retorna nulo
        return null;
    }

    /**
     * Método utilizado para alterar um diretor na base de dados
     * @param directorId id do diretor a ser atualizado
     * @param director dados do diretor a ser alterado 
     * @param transaction instância da transação que tá controlando a operação
     * @returns retorna um objeto com as informações do diretor alterado ou null se o diretor não foi encontrado
     */
    async updateDirector(directorId, director, transaction) {

        //faz a busca do diretor com base no id para verificar se o mesmo existe na base de dados
        const directorCollection = await Director.findByPk(directorId, {include: [userDirector]});

        //se encontrou
        if(directorCollection) {

            //atualiza as informações do diretor com base nos dados informados como parâmetro
            await directorCollection.update(director, transaction);

            //retorna o diretor com as informações atualizadas
            return directorCollection;
        }
        
        //se não encontrou retorna null
        return null;
    }

    /**
     * Método utilizado para remover um diretor na base de dados
     * @param directorId id do diretor a ser atualizado
     * @param transaction instância da transação que tá controlando a operação
     * @returns retorna um objeto com as informações do diretor removido ou null se o diretor não foi encontrado
     */
    async deleteDirector(directorId, transaction) {

        //faz a busca do diretor com base no id para verificar se o mesmo existe na base de dados
        const directorCollection = await Director.findByPk(directorId);

        //se encontrou
        if(directorCollection) {

            //remove o cadastro do diretor na base de dados
            await directorCollection.destroy(transaction);

            //retorna o diretor removido
            return directorCollection;
        }
        
        //se não encontrou retorna null
        return null;
    }

     /**
     * Método que deleta todos os diretores cadastrados na base de dados
     * @param transaction instância da transação que tá controlando a operação
     */
    async deleteAllDirectors(transaction) {

        //deleta todos os diretores na base de dados
        await Director.destroy({
            where: {},
            truncate: false,
            transaction
        });
    }

    /**
     * Método que conta o total do diretores cadastrados na base de dados
     * @returns total do diretores cadastrados
     */
    async countDirectors() {

        //faz a busca utilizando a função de agregação count para contar o total do diretores cadastrados
        const countDirectors = await Director.findAll({
            attributes: [
                [Sequelize.fn('count', Sequelize.col('directorId')), 'countDirectors']
            ]
        });

        //retorna o total do diretores
        return countDirectors;
    }
}

//exporta uma instância já criada da classe para ser utilizada em outros arquivos
module.exports = new DirectorPersistence();