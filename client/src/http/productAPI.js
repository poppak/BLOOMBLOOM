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
export const updatePurchase = async (id, updatedPurchase) => {
    const {data} = await $authHost.put(`api/purchase/${id}`, updatedPurchase);
    return data;
}
export const createPreorderProduct = async (preorderProduct) => {
    const {data} = await $authHost.post('api/preorder_product/', preorderProduct)
    return data
}
export const fetchPreorderProducts = async () => {
    const {data} = await $host.get('api/preorder_product')
    return data
}
export const deletePreorderProduct = async (purchaseId, productId) => {
    const {data} = await $authHost.delete('api/preorder_product/' + purchaseId + '/' + productId)
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
export const fetchBaskets = async () => {
    const {data} = await $authHost.get('api/basket/')
    return data
}
export const createBasketProduct = async (product) => {
    const {data} = await $authHost.post('api/basket_product', product)
    return data
}
export const deleteBasketProduct = async (id) => {
    const {data} = await $authHost.delete('api/basket_product/' + id)
    return data
}
export const fetchBasketProducts = async () => {
    const {data} = await $authHost.get('api/basket_product/')
    return data
}
export const createOrder = async (order) => {
    const {data} = await $authHost.post('api/order/', order)
    return data
}
export const fetchOrders = async () => {
    const {data} = await $authHost.get('api/order/')
    return data
}
export const updateOrder = async (id, order, statusOrder) => {
    const dataToSend = { ...order, statusOrder: statusOrder };
    const {data} = await $authHost.put(`api/order/${id}`, dataToSend);
    return data;
}
export const fetchOrdersProduct = async () => {
    const {data} = await $authHost.get('api/order_product/')
    return data
}
export const sendEmailNotification = async (subject, name, orderDetails) => {
    try {
        const { data } = await $authHost.post('api/sendEmailNotification/', { subject, name, orderDetails });
        return data;
    } catch (error) {
        console.error('Ошибка при отправке уведомления на почту:', error);
        throw error;
    }
};