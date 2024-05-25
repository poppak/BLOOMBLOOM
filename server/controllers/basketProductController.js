const uuid = require("uuid");
const path = require("path");
const {BasketProduct} = require("../models/models");
const ApiError = require("../error/ApiError");

class basketProductController {
    async create(req, res, next) {
        try {
            let {basketId, productId, optionId, quantity} = req.body
            const product = await BasketProduct.create({basketId, productId, optionId, quantity})

            return res.json(product)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }

    }
    async getAll(req, res) {
        const basketProducts = await BasketProduct.findAll()
        return res.json(basketProducts)
    }
    async delete(req, res, next) {
        try {
            const {id} = req.params;
            const deletedProduct = await BasketProduct.destroy({where: {id}});

            if (!deletedProduct) {
                return res.status(404).json({message: 'Продукт не найден'});
            }

            return res.json({message: 'Продукт успешно удален'});
        } catch (e) {
            next(ApiError.internalServerError(e.message));
        }
    }
}

module.exports = new basketProductController()