import {makeAutoObservable} from "mobx";

export default class PreorderProductStore {
    constructor() {
        this._categories = [
            {id: 1, name: 'lips'},
            {id: 2, name: 'eyes'}
        ]
        this._products = [
            {id: 1, name: 'romnd water tint', description: 'Глянцевый тинт для губ', categoryId: 1},
            {id: 2, name: 'peripera eye palette', description: 'Тени для век', categoryId: 2},
            {id: 3, name: 'amuse', description: 'бальзам', categoryId: 1},
        ]
        this._preorder_products = [
            {id: 1, productId: 1, optionId: 1, purchaseId: 1, price: 1200},
            {id: 2, productId: 3, purchaseId: 3, price: 1200},
            {id: 3, productId: 2, optionId: 2, purchaseId: 1, price: 4200},
            {id: 4, productId: 2, optionId: 2, purchaseId: 3, price: 1200}
        ]
        this._options =  [
            {id: 1, name: '01', productId: 1, img: 'https://optim.tildacdn.com/stor6364-3235-4134-b538-353130663633/-/format/webp/81928742.jpg'},
            {id: 2, name: '02', productId: 2, img: 'https://optim.tildacdn.com/stor6364-3235-4134-b538-353130663633/-/format/webp/81928742.jpg'},
            {id: 3, name: '03', productId: 1, img: 'https://optim.tildacdn.com/stor6364-3235-4134-b538-353130663633/-/format/webp/81928742.jpg'},
        ]
        this._purchases =  [
            {id: 1, dateStart: '2024-01-01', dateFinish: '2024-01-31', statusPurchase: 'Закрыта', minSumma: 10000, factSumma: 15000, planDelivery: 3000, factDelivery: 3200},
            {id: 2, dateStart: '01.02.2024', dateFinish: '25.03.2024', statusPurchase: 'Закрыта'},
            {id: 3, dateStart: '01.04.2024', dateFinish: '30.04.2024', statusPurchase: 'Запись открыта'},
        ]
        this._selectedCategory = {};
        this._filteredProducts = [];
        this._preorderedProducts = [];
        this._selectedOption = {};
        makeAutoObservable(this)
    }

    setCategories(categories) {
        this._categories = categories
    }
    setProducts(products) {
        this._products = products
    }
    setPreorderProducts(preorderProducts) {
        this._preorder_products = preorderProducts
    }
    setOptions(options) {
        this._options = options
    }
    setPurchases(purchases) {
        this._purchases = purchases
    }

    setSelectedCategory(category) {
        this._selectedCategory = category
    }
    setFilteredProducts(products) {
        this._filteredProducts = products
    }
    setPreorderedProducts(products) {
        this._preorderedProducts = products
    }
    setSelectedOption(option) {
        this._selectedOption = option
    }

    get categories() {
        return this._categories
    }
    get products() {
        return this._products
    }
    get preorderProducts() {
        return this._preorder_products
    }
    get options() {
       return this._options
    }
    get purchases() {
        return  this._purchases
    }
    get selectedCategory() {
        return this._selectedCategory
    }
    get filteredProducts() {
        return this._filteredProducts
    }
    get preorderedProducts() {
        return this._preorderedProducts
    }
    get selectedOption() {
        return this._selectedOption
    }
}