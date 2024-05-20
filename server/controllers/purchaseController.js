const ApiError = require('../error/ApiError')
const {Purchase, PreorderProduct} = require("../models/models");

class PurchaseController {
    async create(req, res, next) {
        try {
            let {dateStart, dateFinish, minSumma, factSumma, planDelivery, factDelivery, statusPurchase, baseCost, preorderProducts} = req.body
            const purchase = await Purchase.create({dateStart, dateFinish, minSumma, factSumma, planDelivery, factDelivery, statusPurchase, baseCost})

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

    async update(req, res, next) {
        try {
            const {id} = req.params;
            const {dateStart, dateFinish, minSumma, factSumma, planDelivery, factDelivery, statusPurchase, baseCost} = req.body;
            await Purchase.update({dateStart, dateFinish, minSumma, factSumma, planDelivery, factDelivery, statusPurchase, baseCost}, {
                where: {id}
            });
            return res.json({message: 'Purchase updated successfully'});
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

}

module.exports = new PurchaseController()