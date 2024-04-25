const Router = require('express')
const router = new Router()
const userRouter = require('./userRouter')
const roleRouter = require('./roleRouter')
const categoryRouter = require('./categoryRouter')
const productRouter = require('./productRouter')
const preorderProductRouter = require('./preorderProductRouter')
const purchaseRouter = require('./purchaseRouter')
const optionRouter = require('./optionRouter')

router.use('/role', roleRouter)
router.use('/user', userRouter)
router.use('/category', categoryRouter)
router.use('/product', productRouter)
router.use('/preorder_product', preorderProductRouter)
router.use('/purchase', purchaseRouter)
router.use('/option', optionRouter)

module.exports = router