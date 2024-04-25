import React, {useContext, useEffect, useState} from 'react';
import {Container, DropdownButton, Row, Dropdown} from "react-bootstrap";
import {Context} from "../index";
import PreorderProductList from "../components/PreorderProductList";
import {fetchCategories, fetchPreorderProducts, fetchProducts, fetchPurchases} from "../http/productAPI";

const Shop = () => {
    const { product } = useContext(Context);
    const [loading, setLoading] = useState(true);
    const [selectedCategoryName, setSelectedCategoryName] = useState("preorder");
    const [filteredProducts, setFilteredProducts] = useState([])

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

    const handleCategorySelect = (category) => {
        console.log(category.id);
        if (product.selectedCategory && product.selectedCategory.id === category.id) {
            return;}
        product.setSelectedCategory(category);
        filterCategoryProducts(category.id);
        setSelectedCategoryName(category.name);
    }
    if (product.purchases) {
        console.log(product.purchases);
    }
    const purchase = product.purchases.find(pur => pur.statusPurchase === "Запись открыта").id
    product.preorderProducts.forEach((preorderProduct) => {
        if (preorderProduct.purchaseId === purchase) {
            const productToAdd = product.products.find(prod => prod.id === preorderProduct.productId);
            if (productToAdd && !product.preorderedProducts.some(p => p.id === productToAdd.id)) {
                const extendedProduct = {
                    ...productToAdd,
                    price: preorderProduct.price,
                    purchaseId: preorderProduct.purchaseId
                };
                product.setPreorderedProducts([...product.preorderedProducts, extendedProduct]);
            } else if (!productToAdd) {
                console.log('Продукт с id ' + preorderProduct.productId + ' не найден');
            }
        } else {
            console.log(preorderProduct.id + ' не входит в закупку');
        }
    });
    console.log(product.filteredProducts)
    const filterCategoryProducts = (categoryId) => {
        setFilteredProducts(product.preorderedProducts.filter(product => product.categoryId === categoryId));
        console.log(filteredProducts)
    }

    return (
        <Container>
            <Row>
                <h1 style={{textAlign: 'center', marginTop: '4%', marginBottom: '4%'}}>{selectedCategoryName}</h1>
            </Row>
            <Row>
                <DropdownButton id="dropdown-basic-button" title="Категория" style={{fontSize: '14px'}}>
                    {product.categories && product.categories.map(category =>
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
            <PreorderProductList preorderedProducts={product.preorderedProducts} filteredProducts={filteredProducts} selectedCategory={selectedCategoryName}/>
        </Container>
    );

};

export default Shop;