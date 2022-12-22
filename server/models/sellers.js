
module.exports = (sequelize, DataType) => {

    /**
     * Configuração da entidade Venderor pelo Sequelize
     * Aqui são definidos os nomes dos campos da entidade e os seus respectivos tipos de dados
     */
    const Seller = sequelize.define('sellers', {
        sellerId: {
            type: DataType.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: DataType.INTEGER
        },
        unityId: {
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
     * Como a entidade Vendedor possui uma chave estrangeira com o usuário e a unidade, também é feita essa configuração e dada um nome para a mesma
     */
    Seller.associate = function (models) {
        Seller.belongsTo(models.users,{
            foreignKey : 'userId',
            as: 'userSeller'
        });
        Seller.belongsTo(models.units,{
            foreignKey : 'unityId',
            as: 'unitySeller'
        });
    };

    return Seller;
}