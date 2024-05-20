const Router = require('express')
const router = new Router()
const userRouter = require('./userRouter')
const roleRouter = require('./roleRouter')
const categoryRouter = require('./categoryRouter')
const productRouter = require('./productRouter')
const preorderProductRouter = require('./preorderProductRouter')
const purchaseRouter = require('./purchaseRouter')
const optionRouter = require('./optionRouter')
const basketProductRouter = require('./basketProductRouter')
const basketRouter = require('./basketRouter')
const orderRouter = require('./orderRouter')
const emailRouter = require('./emailRouter')
const orderProductRouter = require('./orderProductRouter')

router.use('/role', roleRouter)
router.use('/user', userRouter)
router.use('/category', categoryRouter)
router.use('/product', productRouter)
router.use('/preorder_product', preorderProductRouter)
router.use('/purchase', purchaseRouter)
router.use('/option', optionRouter)
router.use('/basket_product', basketProductRouter)
router.use('/basket', basketRouter)
router.use('/order', orderRouter)
router.use('/sendEmailNotification', emailRouter)
router.use('/order_product', orderProductRouter)


module.exports = router