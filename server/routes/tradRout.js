const express = require('express')
const { signUp } = require('../controllers/traderController/signUp')
const { uploadProductImageMiddleware } = require('../utils/fileUtility')
const { postProduct, getProduct } = require('../controllers/traderController/product')

const router = express.Router()


router.post('/sign-up', signUp)
router.post('/post-product', uploadProductImageMiddleware, postProduct)
router.get('/get-product', getProduct)


module.exports = router