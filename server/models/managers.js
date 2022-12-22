
module.exports = (sequelize, DataType) => {

    /**
     * Configuração da entidade Gerente pelo Sequelize
     * Aqui são definidos os nomes dos campos da entidade e os seus respectivos tipos de dados
     */
    const Manager = sequelize.define('managers', {
        managerId: {
            type: DataType.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: DataType.INTEGER
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
     * Como a entidade Gerente possui uma chave estrangeira com o usuário, também é feita essa configuração e dada um nome para a mesma
     */
    Manager.associate = function (models) {
        Manager.belongsTo(models.users,{
            foreignKey : 'userId',
            as: 'userManager'
        });
    };

    return Manager;
}