const ApiError = require('../error/ApiError')
const {Order, OrderProduct} = require("../models/models");

class OrderController {
    async create(req, res, next) {
        try {
            let {statusOrder, summaOrder, summaDeliveryInRU, purchaseId, userId, orderProducts} = req.body
            const order = await Order.create({statusOrder, summaOrder, summaDeliveryInRU, purchaseId, userId})

            if (orderProducts) {
                orderProducts = JSON.parse(orderProducts);
                console.log(orderProducts)
                orderProducts.forEach(i =>
                    OrderProduct.create({
                        preorderProductId: i.preorderProductId,
                        orderId: order.id,
                        quantity: i.quantity
                    })
                )
            }
            return res.json(order)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }

    }

    async getAll(req, res) {
        const orders = await Order.findAll()
        return res.json(orders)
    }


}

module.exports = new OrderController()