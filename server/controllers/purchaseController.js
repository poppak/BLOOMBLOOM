const ApiError = require('../error/ApiError')
const {Purchase} = require("../models/models");
const uuid = require("uuid");
const path = require("path");

class PurchaseController {
    async create(req, res, next) {
        try {
            let {dateStart, dateFinish, minSumma, factSumma, planDelivery, factDelivery, statusPurchase} = req.body
            const purchase = await Product.create({dateStart, dateFinish, minSumma, factSumma, planDelivery, factDelivery, statusPurchase})
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