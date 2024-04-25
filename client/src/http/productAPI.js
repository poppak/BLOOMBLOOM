import {$authHost, $host} from "./index";

export const createProduct = async (product) => {
    const {data} = await $authHost.post('api/product', product)
    return data
}

export const fetchProducts = async () => {
    const {data} = await $authHost.get('api/product')
    return data
}

export const createPurchase = async (purchase) => {
    const {data} = await $authHost.post('api/purchase', purchase)
    return data
}

export const fetchPurchases = async () => {
    const {data} = await $authHost.get('api/purchase')
    return data
}
export const fetchPreorderProducts = async () => {
    const {data} = await $host.get('api/preorder_product')
    return data
}
export const fetchOneProduct = async (id) => {
    const {data} = await $host.get('api/product/' + id)
    return data
}
export const fetchCategories = async () => {
    const {data} = await $authHost.get('api/category')
    return data
}
export const fetchOptions = async () => {
    const {data} = await $authHost.get('api/option')
    return data
}
