import {makeAutoObservable} from "mobx";
export default class ClientStore {
    constructor() {
        this._baskets = []
        this._basketProducts = []
        this._orders = []
        this._ordersProduct = []

        makeAutoObservable(this)
    }

    setBaskets(baskets) {
        this._baskets = baskets
    }
    setBasketProducts(basketProducts) {
        this._basketProducts = basketProducts
    }
    setOrders(orders){
        this._orders = orders
    }
    setOrdersProduct(ordersProduct) {
        this._ordersProduct = ordersProduct
    }

    get baskets() {
        return this._baskets
    }
    get basketProducts() {
        return this._basketProducts
    }
    get orders(){
        return this._orders
    }
    get ordersProduct() {
        return this._ordersProduct
    }
}