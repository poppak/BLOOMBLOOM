import {makeAutoObservable} from "mobx";

export default class PreorderProductStore {
    constructor() {
        this._categories = []
        this._products = []
        this._preorder_products = []
        this._options =  []
        this._purchases =  []
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