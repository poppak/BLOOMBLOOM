const ApiError = require('../error/ApiError')
const {PreorderProduct, Option} = require("../models/models");
const uuid = require("uuid");
const path = require("path");

class PreorderProductController {
    async create(req, res, next) {
        try {
            const {productId, purchaseId, quantity, price} = req.body
            const options = await Option.findAll({ where: { productId: productId }, attributes: ['optionId'] })
            const optionIds = options.map(option => option.optionId)
            // Проверяем, что переданный optionId принадлежит productId
            const {optionId} = req.body
            if (!optionIds.includes(optionId)) {
                throw new Error('Характеристика не относится к данному продукту')
            }
            const preorderProduct = await PreorderProduct.create({productId, optionId, purchaseId, quantity, price})
            return res.json(preorderProduct)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }

    }

    async getAll(req, res) {
        const preorderProducts = await PreorderProduct.findAll()
        return res.json(preorderProducts)
    }

    async getOne(req, res) {
        const {id} = req.params
        const preorderProduct = await PreorderProduct.findOne(
            {
                where: {id}
            }
        )
        return res.json(preorderProduct)
    }

}

module.exports = new PreorderProductController()