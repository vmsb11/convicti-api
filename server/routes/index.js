const express = require('express');
const router = express.Router();
const { formatDatetime } = require('../helpers/date_helpers');
const { verifyJWTToken } = require('../helpers/api_helpers');
const UserController = require('../controllers/userController');
const DirectorController = require('../controllers/directorController');
const BoardController = require('../controllers/boardController');
const ManagerController = require('../controllers/managerController');
const SaleController = require('../controllers/saleController');
const SellerController = require('../controllers/sellerController');
const UnityController = require('../controllers/unityController');

/**
 * Define as rotas da API
 * Nas que precisam de autenticação, passa como parâmetro a função de middleware que checa se o token de autenticação é válido
 */
router.get('/users/', verifyJWTToken, UserController.searchUsers);
router.get('/users/:id', verifyJWTToken, UserController.findUserById);
router.get('/users/tasks/count', verifyJWTToken, UserController.countUsers);
router.post('/users/', UserController.createUser);
router.put('/users/:id', verifyJWTToken, UserController.updateUser);
router.post('/users/login', UserController.authenticateUser);
router.post('/users/recovery', UserController.recoverUserPassword);

router.get('/directors/', verifyJWTToken, DirectorController.searchDirectors);
router.get('/directors/:id', verifyJWTToken, DirectorController.findDirectorById);
router.get('/directors/tasks/count', verifyJWTToken, DirectorController.countDirectors);
router.post('/directors/', DirectorController.createDirector);
router.put('/directors/:id', verifyJWTToken, DirectorController.updateDirector);

router.get('/boards/', verifyJWTToken, BoardController.searchBoards);
router.get('/boards/:id', verifyJWTToken, BoardController.findBoardById);
router.get('/boards/tasks/count', verifyJWTToken, BoardController.countBoards);
router.post('/boards/', verifyJWTToken, BoardController.createBoard);
router.put('/boards/:id', verifyJWTToken, BoardController.updateBoard);

router.get('/units/', verifyJWTToken, UnityController.searchUnits);
router.get('/units/:id', verifyJWTToken, UnityController.findUnityById);
router.get('/units/tasks/count', verifyJWTToken, UnityController.countUnits);
router.post('/units/', verifyJWTToken, UnityController.createUnity);
router.put('/units/:id', verifyJWTToken, UnityController.updateUnity);

router.get('/sellers/', verifyJWTToken, SellerController.searchSellers);
router.get('/sellers/:id', verifyJWTToken, SellerController.findSellerById);
router.get('/sellers/tasks/count', verifyJWTToken, SellerController.countSellers);
router.post('/sellers/', SellerController.createSeller);
router.put('/sellers/:id', verifyJWTToken, SellerController.updateSeller);

router.get('/sales/', verifyJWTToken, SaleController.searchSales);
router.get('/sales/:id', verifyJWTToken, SaleController.findSaleById);
router.get('/sales/tasks/count', verifyJWTToken, SaleController.countSales);
router.post('/sales/', SaleController.createSale);
router.put('/sales/:id', verifyJWTToken, SaleController.updateSale);

router.get('/managers/', verifyJWTToken, ManagerController.searchManagers);
router.get('/managers/:id', verifyJWTToken, ManagerController.findManagerById);
router.get('/managers/tasks/count', verifyJWTToken, ManagerController.countManagers);
router.post('/managers/', ManagerController.createManager);
router.put('/managers/:id', verifyJWTToken, ManagerController.updateManager);

/**
 * Função especial que verifica se a rota não existe, se não existir, envia uma mensagem indicadno
 */
router.use(function(req, res, next) {
    if (!req.route) {
        res.status(404).send({
            code: 404,
            type: 'error',
            message: 'Rota não encontrada',
            date: formatDatetime(new Date())
        });
        return;
    }
    next();
});

module.exports = router;