import React, {useContext, useState} from 'react';
import {Context} from "../index";
import {Image, Row, Table} from "react-bootstrap";
import UpdateProduct from "./modals/UpdateProduct";

const ProductList = () => {
    const {product} = useContext(Context)
    const productsToDisplay = product.filteredProducts.length > 0 ? product.filteredProducts : product.products
    const cat = product.categories
    const options = product.options
    const [productVisible, setProductVisible] = useState(false)
    const [selectedProductIndex, setSelectedProductIndex] = useState(null);
    const handleProductClick = (index) => {
        setSelectedProductIndex(index);
        setProductVisible(true);
    };
    return (
        <Table striped bordered hover style={{borderCollapse: 'collapse', borderColor: 'transparent', borderBottom: '1px lightgrey'}}>
            <thead>
            <tr style={{textAlign: 'center'}}>
                <th style={{fontWeight: '300', width: 20}}>№</th>
                <th style={{fontWeight: '300', width: '60px'}}>Фото</th>
                <th style={{fontWeight: '300', width: 400}}>Наименование</th>
                <th style={{fontWeight: '300', width: 500}}>Описание</th>
                <th style={{fontWeight: '300', width: 500}}>Категория</th>
                <th style={{fontWeight: '300', width: 500}}>Варианты</th>
            </tr>
            </thead>
            <tbody>
            {productsToDisplay.map((product, index) => (
                <tr key={product.id} style={{ fontSize: '20px' }} onClick={() => handleProductClick(index)}>
                    <td style={{ textAlign: 'center', fontSize: '16px' }}>{index + 1}</td>
                    <td style={{ textAlign: 'center' }}><Image width={50} height={50} src={product.img} /></td>
                    <td style={{ fontWeight: '400' }}>{product.name}</td>
                    <td>{product.description}</td>
                    <td>{cat.find(category => category.id === product.categoryId).name}</td>
                    <td style={{ fontSize: '16px' }}>{options.filter(op => op.productId === product.id).map(option => option.name).join('; ')}</td>
                </tr>
            ))}
            </tbody>
            <UpdateProduct show={productVisible} onHide={() => setProductVisible(false)} selectedProduct={selectedProductIndex !== null ? productsToDisplay[selectedProductIndex] : {}} />
        </Table>

    );
};

export default ProductList;