import {
    ADMIN_ROUTE,
    BASKET_ROUTE,
    PREORDER_PRODUCT_ROUTE,
    PRODUCT_ROUTE,
    PURCHASE_ROUTE,
    SHOP_ROUTE
} from "./utils/consts";
import {LOGIN_ROUTE} from "./utils/consts";
import {REGISTRATION_ROUTE} from "./utils/consts";
import Admin from './pages/Admin';
import Auth from './pages/Auth';
import Shop from './pages/Shop';
import Product from './pages/ProductPage'
import Basket from "./pages/Basket";
import PreorderProduct from "./pages/PreorderProductPage";
import Purchase from "./pages/PurchasePage"

export const authRoutes = [
    {
        path: ADMIN_ROUTE,
        Component: Admin
    },
    {
        path: PRODUCT_ROUTE,
        Component: Product
    },
    {
        path: BASKET_ROUTE,
        Component: Basket
    },
    {
        path: PURCHASE_ROUTE,
        Component: Purchase
    }
]

export const publicRoutes = [
    {
        path: LOGIN_ROUTE,
        Component: Auth
    },
    {
        path: REGISTRATION_ROUTE,
        Component: Auth
    },
    {
        path: SHOP_ROUTE,
        Component: Shop
    },
    {
        path: PREORDER_PRODUCT_ROUTE + '/:id',
        Component: PreorderProduct
    }
]