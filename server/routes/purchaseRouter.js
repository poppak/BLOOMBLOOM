const Router = require('express')
const router = new Router()
const purchaseController = require('../controllers/purchaseController')

router.post('/', purchaseController.create)
router.get('/', purchaseController.getAll)
router.get('/:id', purchaseController.getOne)
router.put('/:id', purchaseController.update);


module.exports = router