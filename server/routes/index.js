const Router = require('express')
const router = new Router()
const userRouter = require('./userRouter')
const roleRouter = require('./roleRouter')

router.use('/role', roleRouter)
router.use('/user', userRouter)

module.exports = router