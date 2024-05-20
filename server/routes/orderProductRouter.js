const Router = require('express')
const router = new Router()
const orderProductController = require('../controllers/orderProductController')

router.get('/', orderProductController.getAll)

module.exports = router