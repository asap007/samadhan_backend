const express = require('express');
const router = express.Router();
const adviceController = require('../controllers/adviceController');
const productController = require('../controllers/productController');

router.post('/financial-strategy', adviceController.getFinancialAdvice);
router.post('/product-advice', productController.getProductAdvice)

module.exports = router;


