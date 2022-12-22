const Sequelize = require('sequelize');

function getQueryFilter(columns, parameter) {

    const Op = Sequelize.Op;
    const filter = [];
    
    for(let i = 0; i < columns.length; i++) {

        const column = columns[i];
        const obj = {[Op.like]: '%' + parameter + '%' };

        filter.push({[column]: obj});
    }

    const query = {
        where: {
            [Op.or]: filter
        }
    };

    return query;
}

function getPagination(page, size) {
    
    const limit = size ? + size : 10;
    const offset = page ? page * limit : 0;
    
    return { limit, offset };
};

function getPagingData(items, page, limit) {
    
    const { count: totalItems, rows: data } = items;
    let currentPage = page ? +page : 1;
    const totalPages = Math.ceil(totalItems / limit);
    
    return { totalItems, data, totalPages, currentPage };
};

function getPagingGroupData(items, page, limit) {
    
    const { rows: data } = items;
    const totalItems = items.count.length;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);
    
    return { totalItems, data, totalPages, currentPage };
};

function getPagingData2(items, count, page, limit) {
    
    const totalItems = count;
    const data = items;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);
    
    return { totalItems, data, totalPages, currentPage };
};

module.exports = { 
    getQueryFilter, 
    getPagination, 
    getPagingData, 
    getPagingData2,
    getPagingGroupData 
};