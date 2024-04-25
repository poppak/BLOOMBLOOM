import React, {useEffect} from 'react';
import {Card, Col, Image} from "react-bootstrap";
import {useHistory} from "react-router-dom";
import {PREORDER_PRODUCT_ROUTE} from "../utils/consts";
import {fetchCategories, fetchPreorderProducts, fetchProducts, fetchPurchases} from "../http/productAPI";

const PreorderProductItem = ({product}) => {
    const history = useHistory()
    const productString = JSON.stringify(product);
    console.log(productString)
    return (
        <Col md={4} onClick={() => history.push({
            pathname: `${PREORDER_PRODUCT_ROUTE}/${product.id}`,
        })}>
            <Card style={{width: 350, cursor: 'pointer'}} border={"light"} className="mt-1">
                <Image width={350} height={350} src={process.env.REACT_APP_API_URL + product.img}/>
                <div style={{fontWeight: 400, fontSize: '18px'}}>
                    {product.name}
                </div>
                <div style={{fontSize: '16px'}}>
                    {product.description}
                </div>
                <div className="mt-2" style={{fontWeight: 400, fontSize: '20px', color: '#f3a0d5'}}>
                    {product.price + ' р.'}
                </div>
            </Card>
        </Col>
    );
};

export default PreorderProductItem;