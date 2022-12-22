
module.exports = (sequelize, DataType) => {

    /**
     * Configuração da entidade Unidade pelo Sequelize
     * Aqui são definidos os nomes dos campos da entidade e os seus respectivos tipos de dados
     */
    const Unity = sequelize.define('units', {
        unityId: {
            type: DataType.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        managerId: {
            type: DataType.INTEGER
        },
        boardId: {
            type: DataType.INTEGER
        },
        name: {
            type: DataType.STRING
        },
        latLon: {
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
     * Como a entidade Unidade possui uma chave estrangeira com o gerente e diretoria, também é feita essa configuração e dada um nome para a mesma
     */
    Unity.associate = function (models) {
        Unity.belongsTo(models.managers,{
            foreignKey : 'managerId',
            as: 'managerUnity'
        });
        Unity.belongsTo(models.boards,{
            foreignKey : 'boardId',
            as: 'boardUnity'
        });
    };

    return Unity;
}