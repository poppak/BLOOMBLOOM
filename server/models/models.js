const sequelize = require('../db')
const {DataTypes} = require("sequelize");

const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    email: {type: DataTypes.STRING, unique: true},
    phone: {type: DataTypes.STRING, unique: true},
    password: {type: DataTypes.STRING},
})

const Role = sequelize.define('role', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false},
})

const Basket = sequelize.define('basket', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

const BasketProduct = sequelize.define('basket_product', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

const Product = sequelize.define('product', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false},
    img: {type: DataTypes.STRING, allowNull: false},
    description: {type: DataTypes.STRING, allowNull: false}
})

const Category = sequelize.define('category', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false},
})

//характеристика
const Option = sequelize.define('option', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false},
    img: {type: DataTypes.STRING, allowNull: false},
})

const Purchase = sequelize.define('purchase', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    dateStart: {type: DataTypes.DATE, allowNull: false},
    dateFinish: {type: DataTypes.DATE, allowNull: false},
    minSumma: {type: DataTypes.INTEGER, allowNull: false},
    factSumma: {type: DataTypes.INTEGER},
    planDelivery: {type: DataTypes.INTEGER, allowNull: false},
    factDelivery: {type: DataTypes.INTEGER},
    statusPurchase: {type: DataTypes.STRING, allowNull: false}
})

const PreorderProduct = sequelize.define('preorder_product', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    quantity: {type: DataTypes.INTEGER, allowNull: false},
    price: {type: DataTypes.INTEGER, allowNull: false},
})

Role.hasOne(User)
User.belongsTo(Role)

User.hasOne(Basket)
Basket.belongsTo(User)

Basket.hasMany(BasketProduct)
BasketProduct.belongsTo(Basket)

Category.hasMany(Product)
Product.belongsTo(Category)

Product.hasMany(BasketProduct)
BasketProduct.belongsTo(Product)

Product.hasMany(Option, {as: 'options'})
Option.belongsTo(Product)

Product.hasMany(PreorderProduct)
PreorderProduct.belongsTo(Product)

Option.hasMany(PreorderProduct)
PreorderProduct.belongsTo(Option)

Purchase.hasMany(PreorderProduct)
PreorderProduct.belongsTo(Purchase)

module.exports = {
    User,
    Role,
    Basket,
    BasketProduct,
    Category,
    Option,
    Purchase,
    PreorderProduct,
    Product
}