const Sequelize = require('sequelize');
const Board = require('../models').boards;
const Director = require('../models').directors;
const User = require('../models').users;
const { getQueryFilter, getPagination, getPagingData } = require('../helpers/search_helpers');
const columns = [
    'boardId',
    'directorId',
    'name',
    'createdAt', 
    'updatedAt',
    '$directorBoard.userDirector.name$'
];
//variável que faz a associação da entidade diretor com a diretoria, permitindo assim trazer nos resultados das buscas das diretorias as informações do diretor associado a cada board
const directorBoard = {
    model: Director,
    as: 'directorBoard',
    include: {
        model: User,
        as: 'userDirector'
    }
};
//variável de instância da própria classe
let instance = null;

/**
 * Classe na qual são implementados os métodos que realizam a manipulação das informações da Entidade Board como cadastrar, consultar, consulta por campos, editar, remover e etc
 */
class BoardPersistence {

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
     * Método utilizado para cadastrar uma diretoria na base de dados
     * @param board dados da diretoria a ser cadastrada 
     * @param transaction instância da transação que tá controlando a operação
     * @returns retorna um objeto com as informações da diretoria cadastrada
     */
    async createBoard(board, transaction) {

        //cria a diretoria na base de dados
        const newBoard = await Board.create(board, transaction);
    
         //retorna a diretoria criado
        return newBoard;
    }

    /**
     * Método que realiza uma busca de todos as diretorias cadastradas
     * @param parameter parâmetro de busca, se o valor informado for "undefined", o filtro é ignorado
     * @param page página atual da busca
     * @param size total de registros por página
     * @returns uma lista das diretorias cadastradas ou uma lista vazia caso não seja encontrada 
     */
    async searchBoards(parameter, page, size) {

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
        //inclui na busca as informações do diretor associado as diretorias enconttrados
        query.include = [directorBoard];
        
        //se o parâmetro for informado
        if(parameter) {
            
            //monta o filtro de busca filtrando cada uma das colunas escolhidas com o parâmetro informado
            const searchFilter = getQueryFilter(columns, parameter);
            
            query.where = {...query.where, [Op.and]: searchFilter.where};
        }
        
        //faz a busca na base de dados com base nas configurações de busca realizadas com a paginação configurada
        const boardsCollection = await Board.findAndCountAll(query);
        
        //retorna uma lista com as informações das diretorias configurado por página
        return getPagingData(boardsCollection, page, limit);
    }

    /**
     * Método que realiza a busca da diretoria por meio do seu id
     * @param boardId id da diretoria a ser buscado 
     * @returns retorna as informações da diretoria ou null caso não seja encontrada
     */
    async findBoardById(boardId) {

        //realiza a busca da diretoria por meio do seu id e inclui no resultado da busca as informações do diretor associado a essa diretoria
        const boardCollection = await Board.findByPk(boardId, { include: [directorBoard] });

        //se encontrou retorna as informações da busca
        if(boardCollection) {

            return boardCollection;
        }
        
        //se não encontrou, retorna nulo
        return null;
    }

    /**
     * Método que realiza a busca da diretoria por meio de um filtro com base em uma lista de chaves (nome dos campos) e valores a serem utilizados para filtrar
     * Exemplo: filtrar por titulo e status então teremos uma lista de chaves do tipo
     * [
     *    {"field": "title", "value": "xxxxxxxxxx" },
     *    {"field": "status", "value": "yyy"}
     * ]
     * @param parameters lista com os campos e os valores a serem utilizados como filtro 
     * @returns retorna as informações da diretoria ou null caso não seja encontrada
     */
     async findBoardByParameters(parameters) {

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

        //faz a busca de um única diretoria com base no filtro montado e inclui no resultado da busca as informações do diretor associado a essa diretoria
        const boardCollection = await Board.findOne(query, { include: [directorBoard] });
        
         //se encontrou retorna as informações da busca
         if(boardCollection) {

            return boardCollection;
        }
        
        //se não encontrou, retorna nulo
        return null;
    }

    /**
     * Método utilizado para alterar uma diretoria na base de dados
     * @param boardId id da diretoria a ser atualizada
     * @param board dados da diretoria a ser alterado 
     * @param transaction instância da transação que tá controlando a operação
     * @returns retorna um objeto com as informações da diretoria alterado ou null se a diretoria não foi encontrada
     */
    async updateBoard(boardId, board, transaction) {

        //faz a busca da diretoria com base no id para verificar se o mesmo existe na base de dados
        const boardCollection = await Board.findByPk(boardId, {include: [directorBoard]});

        //se encontrou
        if(boardCollection) {

            //atualiza as informações da diretoria com base nos dados informados como parâmetro
            await boardCollection.update(board, transaction);

            //retorna a diretoria com as informações atualizadas
            return boardCollection;
        }
        
        //se não encontrou retorna null
        return null;
    }

    /**
     * Método utilizado para remover uma diretoria na base de dados
     * @param boardId id da diretoria a ser atualizada
     * @param transaction instância da transação que tá controlando a operação
     * @returns retorna um objeto com as informações da diretoria removida ou null se a diretoria não foi encontrada
     */
    async deleteBoard(boardId, transaction) {

        //faz a busca da diretoria com base no id para verificar se o mesmo existe na base de dados
        const boardCollection = await Board.findByPk(boardId);

        //se encontrou
        if(boardCollection) {

            //remove o cadastro da diretoria na base de dados
            await boardCollection.destroy(transaction);

            //retorna a diretoria removida
            return boardCollection;
        }
        
        //se não encontrou retorna null
        return null;
    }

     /**
     * Método que deleta todos as diretorias cadastradas na base de dados
     * @param transaction instância da transação que tá controlando a operação
     */
    async deleteAllBoards(transaction) {

        //deleta todos as diretorias na base de dados
        await Board.destroy({
            where: {},
            truncate: false,
            transaction
        });
    }

    /**
     * Método que conta o total das diretorias cadastradas na base de dados
     * @returns total das diretorias cadastradas
     */
    async countBoards() {

        //faz a busca utilizando a função de agregação count para contar o total das diretorias cadastradas
        const countBoards = await Board.findAll({
            attributes: [
                [Sequelize.fn('count', Sequelize.col('boardId')), 'countBoards']
            ]
        });

        //retorna o total das diretorias
        return countBoards;
    }
}

//exporta uma instância já criada da classe para ser utilizada em outros arquivos
module.exports = new BoardPersistence();