
module.exports = (sequelize, DataType) => {

    /**
     * Configuração da entidade Vendas pelo Sequelize
     * Aqui são definidos os nomes dos campos da entidade e os seus respectivos tipos de dados
     */
    const Sale = sequelize.define('sales', {
        saleId: {
            type: DataType.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        sellerId: {
            type: DataType.INTEGER
        },
        boardId: {
            type: DataType.INTEGER
        },
        unityId: {
            type: DataType.INTEGER
        },
        managerId: {
            type: DataType.INTEGER
        },
        amount: {            
            type: DataType.DOUBLE
        },
        location: {            
            type: DataType.STRING
        },
        date: {            
            type: DataType.STRING
        },
        status: {
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
     * Como a entidade Venda possui uma chave estrangeira com o vendedor, dretoria e a unidade, também é feita essa configuração e dada um nome para a mesma
     */
    Sale.associate = function (models) {
        Sale.belongsTo(models.sellers,{
            foreignKey : 'sellerId',
            as: 'sellerSale'
        });
        Sale.belongsTo(models.boards,{
            foreignKey : 'boardId',
            as: 'boardSale'
        });
        Sale.belongsTo(models.units,{
            foreignKey : 'unityId',
            as: 'unitySale'
        });
        Sale.belongsTo(models.managers,{
            foreignKey : 'managerId',
            as: 'managerSale'
        });
    };

    return Sale;
}