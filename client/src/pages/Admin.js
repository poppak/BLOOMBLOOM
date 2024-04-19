import React from 'react';
import {NavLink} from "react-router-dom";
import {PRODUCT_ROUTE, PURCHASE_ROUTE} from "../utils/consts";

const Admin = () => {
    return (
        <div>
            <NavLink to={PURCHASE_ROUTE} className="d-flex justify-content-center" style={{fontWeight: 400, fontSize: '22px'}}> Закупки </NavLink>
            <NavLink to={PRODUCT_ROUTE} className="d-flex justify-content-center" style={{fontWeight: 400, fontSize: '22px'}}> Товары </NavLink>
        </div>
    )
};

export default Admin;