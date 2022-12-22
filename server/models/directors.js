
module.exports = (sequelize, DataType) => {

    /**
     * Configuração da entidade Diretor pelo Sequelize
     * Aqui são definidos os nomes dos campos da entidade e os seus respectivos tipos de dados
     */
    const Director = sequelize.define('directors', {
        directorId: {
            type: DataType.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: DataType.INTEGER
        },
        generalManager: {
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
     * Como a entidade Diretor possui uma chave estrangeira com o usuário, também é feita essa configuração e dada um nome para a mesma
     */
    Director.associate = function (models) {
        Director.belongsTo(models.users,{
            foreignKey : 'userId',
            as: 'userDirector'
        });
    };

    return Director;
}