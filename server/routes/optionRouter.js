const Router = require('express')
const router = new Router()
const optionController = require('../controllers/optionController')

router.get('/', optionController.getAll)

module.exports = router