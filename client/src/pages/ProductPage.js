import React, {useContext, useEffect, useState} from 'react';
import {Context} from "../index";
import {Button, Container, Dropdown, DropdownButton, Row} from "react-bootstrap";
import ProductList from "../components/ProductList";
import CreateProduct from "../components/modals/CreateProduct";
import {fetchCategories, fetchProducts} from "../http/productAPI";
import {observer} from "mobx-react-lite";

const ProductPage = observer(() => {
    const {product} = useContext(Context)
    useEffect(() => {
        fetchProducts().then(data => {
            product.setProducts(data);
            product.setFilteredProducts(data);
        })
        fetchCategories().then(data => product.setCategories(data))
    }, []);

    const [productVisible, setProductVisible] = useState(false)
    const [selectedCategoryName, setSelectedCategoryName] = useState("Товары");
    const handleCategorySelect = (category) => {
        console.log(category.id);
        product.setSelectedCategory(category);
        filterProducts(category.id);
        setSelectedCategoryName(category.name);
    }
    const filterProducts = (categoryId) => {
        const filteredProducts = product.products.filter(product => product.categoryId === categoryId);
        product.setFilteredProducts(filteredProducts);
    }

    return (
        <Container>
            <Row>
                <h1 style={{textAlign: 'center', marginTop: '4%', marginBottom: '4%'}}>{selectedCategoryName}</h1>
            </Row>
            <Row className="d-flex justify-content-center">

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
            <ProductList/>
            <Row className="d-flex justify-content-center">
                <Button
                    className="btn-6"
                    style={{width: 130, height: 40, fontSize: '18px'}}
                    onClick={() => setProductVisible(true)}
                >Добавить</Button>
            </Row>
            <CreateProduct show={productVisible} onHide={() => setProductVisible(false)}/>
        </Container>
    );

});

export default ProductPage;