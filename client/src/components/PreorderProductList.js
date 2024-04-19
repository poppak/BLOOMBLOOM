import React, {useContext} from 'react';
import {observer} from "mobx-react-lite";
import {Context} from "../index";
import {Row} from "react-bootstrap";
import PreorderProductItem from "./PreorderProductItem";

const PreorderProductList = observer(() => {
    const {product} = useContext(Context)
    const productsToDisplay = product.filteredProducts.length > 0 ? product.filteredProducts : product.preorderedProducts;
    console.log(productsToDisplay)
    return (
        <Row className="d-flex">
            {productsToDisplay.map(product =>
                <PreorderProductItem key={product.id} product={product}/>
            )}
        </Row>
    );

});

export default PreorderProductList;