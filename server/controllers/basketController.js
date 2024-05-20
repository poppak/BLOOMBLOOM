const {Basket} = require("../models/models");

class basketController {
    async getAll(req, res) {
        const basket = await Basket.findAll()
        return res.json(basket)
    }
}

module.exports = new basketController()