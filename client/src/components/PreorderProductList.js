import React, {useContext, useEffect, useState} from 'react';
import {observer} from "mobx-react-lite";
import {Context} from "../index";
import {Row} from "react-bootstrap";
import PreorderProductItem from "./PreorderProductItem";
import {fetchCategories, fetchPreorderProducts, fetchProducts, fetchPurchases} from "../http/productAPI";

const PreorderProductList = observer(({filteredProducts, preorderedProducts, selectedCategory}) => {
    const {product} = useContext(Context)
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            fetchCategories(),
            fetchProducts(),
            fetchPurchases(),
            fetchPreorderProducts()
        ]).then(([categories, products, purchases, preorderProducts]) => {
            product.setCategories(categories);
            product.setProducts(products);
            product.setFilteredProducts(products);
            product.setPurchases(purchases);
            product.setPreorderProducts(preorderProducts);
            setLoading(false);
        }).catch(error => {
            console.error('Error loading data:', error);
            setLoading(false);
        });
    }, [product]);

    if (loading) {
        return <div>Loading...</div>;
    }
    let productsToDisplay = []
    console.log(selectedCategory)
    if (selectedCategory !== "preorder") {
        productsToDisplay = filteredProducts.length > 0 ? filteredProducts : [];
    } else {
        productsToDisplay = filteredProducts.length > 0 ? filteredProducts : preorderedProducts;
    }
    console.log(filteredProducts)
    console.log(preorderedProducts)
    return (
        <Row className="d-flex">
            {productsToDisplay.map(product =>
                <PreorderProductItem key={product.id} product={product}/>
            )}
        </Row>
    );

});

export default PreorderProductList;