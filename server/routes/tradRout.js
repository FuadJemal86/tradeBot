const express = require('express')
const { signUp } = require('../controllers/traderController/signUp')
const { postProduct } = require('../controllers/traderController/postProduct')
const { uploadProductImageMiddleware } = require('../utils/fileUtility')

const router = express.Router()


router.post('/sign-up', signUp)
router.post('/post-product', uploadProductImageMiddleware, postProduct)


module.exports = router