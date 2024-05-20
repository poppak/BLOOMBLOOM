const sequelize = require('../db')
const {DataTypes} = require("sequelize");

const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false},
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
    quantity: {type: DataTypes.INTEGER, allowNull: false},
})

const Product = sequelize.define('product', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false},
    img: {type: DataTypes.STRING, allowNull: false},
    description: {type: DataTypes.STRING, allowNull: false},
    fullDescription: {type: DataTypes.STRING, length: 1000},
    volumeProduct: {type: DataTypes.INTEGER, allowNull: false}
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
    statusPurchase: {type: DataTypes.STRING, allowNull: false},
    baseCost: {type: DataTypes.STRING, allowNull: false}
})

const PreorderProduct = sequelize.define('preorder_product', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    price: {type: DataTypes.INTEGER, allowNull: false},
})

const Order = sequelize.define('order', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    statusOrder: {type: DataTypes.STRING, allowNull: false},
    summaOrder: {type: DataTypes.INTEGER, allowNull: false},
    summaDeliveryInRU: {type: DataTypes.INTEGER, allowNull: false},
})

const OrderProduct = sequelize.define('order_product', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    quantity: {type: DataTypes.INTEGER, allowNull: false},
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

Option.hasMany(BasketProduct)
BasketProduct.belongsTo(Option)

Product.hasMany(Option, {as: 'options'})
Option.belongsTo(Product)

Product.hasMany(PreorderProduct)
PreorderProduct.belongsTo(Product)

Option.hasMany(PreorderProduct)
PreorderProduct.belongsTo(Option)

Purchase.hasMany(PreorderProduct, {as: 'preorderProducts'})
PreorderProduct.belongsTo(Purchase)

Order.hasMany(OrderProduct)
OrderProduct.belongsTo(Order)

PreorderProduct.hasMany(OrderProduct)
OrderProduct.belongsTo(PreorderProduct)

Purchase.hasMany(Order)
Order.belongsTo(Purchase)

User.hasMany(Order)
Order.belongsTo(User)

module.exports = {
    User,
    Role,
    Basket,
    BasketProduct,
    Category,
    Option,
    Purchase,
    PreorderProduct,
    Product,
    Order,
    OrderProduct
}