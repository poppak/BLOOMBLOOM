const ApiError = require('../error/ApiError')
const {PreorderProduct} = require("../models/models");
const uuid = require("uuid");
const path = require("path");

class PreorderProductController {
    async create(req, res, next) {
        try {
            const {productId, purchaseId, optionId, price} = req.body
            const preorderProduct = await PreorderProduct.create({productId, optionId, purchaseId, price})
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

    async delete(req, res, next) {
        try {
            const {productId, purchaseId} = req.params;
            const deletedProduct = await PreorderProduct.destroy({where: {productId, purchaseId}});

            if (!deletedProduct) {
                return res.status(404).json({message: 'Продукт не найден'});
            }

            return res.json({message: 'Продукт успешно удален'});
        } catch (e) {
            next(ApiError.internalServerError(e.message));
        }
    }

}

module.exports = new PreorderProductController()