
module.exports = (sequelize, DataType) => {

    /**
     * Configuração da entidade Diretoria pelo Sequelize
     * Aqui são definidos os nomes dos campos da entidade e os seus respectivos tipos de dados
     */
    const Board = sequelize.define('boards', {
        boardId: {
            type: DataType.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        directorId: {
            type: DataType.INTEGER
        },
        name: {
            type: DataType.STRING
        },
        createdAt: {            
            type: DataType.STRING
        },
        updatedAt: {            
            type: DataType.STRING
        }
    }, {
        timestamps: false
    });

    /**
     * Como a entidade Diretoria possui uma chave estrangeira com o diretor, também é feita essa configuração e dada um nome para a mesma
     */
    Board.associate = function (models) {
        Board.belongsTo(models.directors,{
            foreignKey : 'directorId',
            as: 'directorBoard'
        });
    };

    return Board;
}