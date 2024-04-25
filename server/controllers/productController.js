const ApiError = require('../error/ApiError')
const {Product, Option} = require("../models/models");
const uuid = require('uuid')
const path = require('path')

class ProductController {
    async create(req, res, next) {
        try {
            let {name, categoryId, description, options} = req.body
            const {img} = req.files
            console.log(img)
            let fileName = uuid.v4() + ".jpg"
            img.mv(path.resolve(__dirname, '..', 'static', fileName))
            const product = await Product.create({name, categoryId, description, img: fileName})

            if (options) {
                options = JSON.parse(options);
                options.forEach((option, index) => {
                    const optionImg = req.files[`optionImg${index}`];
                    let optionFileName = uuid.v4() + ".jpg";
                    optionImg.mv(path.resolve(__dirname, '..', 'static', optionFileName));
                    Option.create({
                        name: option.name,
                        img: optionFileName,
                        productId: product.id
                    });
                });
            }
            return res.json(product)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
        
    }

    async getAll(req, res) {
        const {categoryId} = req.query
        let products
        if (!categoryId) {
            products = await Product.findAll()
        }
        if (categoryId) {
            products = await Product.findAll({where: {categoryId}})
        }
        return res.json(products)
    }

    async getOne(req, res) {
        const {id} = req.params
        const product = await Product.findOne(
            {
                where: {id},
                include: [{model: Option, as: 'options'}]
            }
        )
        return res.json(product)
    }

}

module.exports = new ProductController()