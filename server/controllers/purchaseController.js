const ApiError = require('../error/ApiError')
const {Purchase, PreorderProduct} = require("../models/models");
const uuid = require("uuid");
const path = require("path");

class PurchaseController {
    async create(req, res, next) {
        try {
            let {dateStart, dateFinish, minSumma, factSumma, planDelivery, factDelivery, statusPurchase, preorderProducts} = req.body
            const purchase = await Purchase.create({dateStart, dateFinish, minSumma, factSumma, planDelivery, factDelivery, statusPurchase})

            if (preorderProducts) {
                preorderProducts = JSON.parse(preorderProducts);
                console.log(preorderProducts)
                preorderProducts.forEach(i =>
                    PreorderProduct.create({
                        price: i.price,
                        productId: i.productId,
                        optionId: i.optionId,
                        purchaseId: purchase.id,
                        quantity: i.quantity
                    })
                )
            }
            return res.json(purchase)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }

    }

    async getAll(req, res) {
        const purchases = await Purchase.findAll()
        return res.json(purchases)
    }

    async getOne(req, res) {
        const {id} = req.params
        const purchase = await Purchase.findOne(
            {
                where: {id}
            }
        )
        return res.json(purchase)
    }

}

module.exports = new PurchaseController()