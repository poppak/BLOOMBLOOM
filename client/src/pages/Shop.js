import React, {useContext, useEffect, useState} from 'react';
import {Container, DropdownButton, Row, Dropdown} from "react-bootstrap";
import {Context} from "../index";
import PreorderProductList from "../components/PreorderProductList";

const Shop = () => {
    const {product} = useContext(Context)
    const [selectedCategoryName, setSelectedCategoryName] = useState("preorder");
    const [products, setProducts] = useState([]);
    console.log(product.selectedCategory.id);
    const handleCategorySelect = (category) => {
        console.log(category.id);
        if (product.selectedCategory && product.selectedCategory.id === category.id) {
            return;}
        product.setSelectedCategory(category);
        filterCategoryProducts(category.id);
        setSelectedCategoryName(category.name);
    }

    const purchase = product.purchases.find(pur => pur.statusPurchase === "Запись открыта").id
    product.preorderProducts.forEach((preorderProduct) => {
        if (preorderProduct.purchaseId === purchase) {
            const productToAdd = product.products.find(prod => prod.id === preorderProduct.productId);
            if (productToAdd && !product.preorderedProducts.some(p => p.id === productToAdd.id)) {
                const extendedProduct = {
                    ...productToAdd,
                    price: preorderProduct.price
                };
                product.setPreorderedProducts([...product.preorderedProducts, extendedProduct]);
            } else if (!productToAdd) {
                console.log('Продукт с id ' + preorderProduct.productId + ' не найден');
            }
        } else {
            console.log(preorderProduct.id + ' не входит в закупку');
        }
    });
    console.log(product.preorderedProducts)
    const filterCategoryProducts = (categoryId) => {
        const filteredProducts = product.preorderedProducts.filter(product => product.categoryId === categoryId);
        product.setFilteredProducts(filteredProducts);
    }

    return (
        <Container>
            <Row>
                <h1 style={{textAlign: 'center', marginTop: '4%', marginBottom: '4%'}}>{selectedCategoryName}</h1>
            </Row>
            <Row>
                <DropdownButton id="dropdown-basic-button" title="Категория" style={{fontSize: '14px'}}>
                    {product.categories.map(category =>
                        <Dropdown.Item
                            onClick={() => handleCategorySelect(category)}
                            key={category.id}
                            style={{fontWeight: 200}}
                        >
                            {category.name}
                        </Dropdown.Item>
                    )}
                </DropdownButton>
            </Row>
            <PreorderProductList/>
        </Container>
    );

};

export default Shop;