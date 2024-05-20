const ApiError = require('../error/ApiError')
const {OrderProduct} = require("../models/models");

class OrderProductController {

    async getAll(req, res) {
        const orderProducts = await OrderProduct.findAll()
        return res.json(orderProducts)
    }


}

module.exports = new OrderProductController()