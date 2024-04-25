const {Option} = require('../models/models')
const ApiError = require('../error/ApiError')

class OptionController {

    async getAll(req, res) {
        const categories = await Option.findAll()
        return res.json(categories)
    }

}

module.exports = new OptionController()