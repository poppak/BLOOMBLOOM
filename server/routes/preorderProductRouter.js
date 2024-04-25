const Router = require('express')
const router = new Router()
const preorderProductController = require('../controllers/preorderProductController')

router.get('/', preorderProductController.getAll)
router.get('/:id', preorderProductController.getOne)

module.exports = router