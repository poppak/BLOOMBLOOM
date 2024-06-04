import {
    ADMIN_ROUTE,
    BASKET_ROUTE,
    PREORDER_PRODUCT_ROUTE,
    PRODUCT_ROUTE,
    PURCHASE_ROUTE,
    SHOP_ROUTE, USER_ROUTE,
    RULES_PURCHASE_ROUTE
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
import User from "./pages/User"
import RulesPurchase from "./pages/RulesPurchase"

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
    },
    {
        path: USER_ROUTE,
        Component: User
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
    },
    {
        path: RULES_PURCHASE_ROUTE,
        Component: RulesPurchase
    },

]