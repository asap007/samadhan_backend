const express = require('express');
const router = express.Router();
const adviceController = require('../controllers/adviceController');
const productController = require('../controllers/productController');
const pdfController = require('../controllers/pdfController');

router.post('/financial-strategy', adviceController.getFinancialAdvice);
router.post('/product-advice', productController.getProductAdvice);

router.post('/pdf-advice', pdfController.getPDFAdvice);
module.exports = router;


