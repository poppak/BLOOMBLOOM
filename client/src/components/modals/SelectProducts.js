import React, {useContext, useState} from 'react';
import {Context} from "../../index";
import {Button, Form, Image, Modal, Table} from "react-bootstrap";

const SelectProducts = ({show, onHide, selectedProducts, setSelectedProducts}) => {
    const {product} = useContext(Context)
    const products = product.products
    const options = product.options

    const handleProductOptionClick = (product, option) => {
        const existingProductIndex = selectedProducts.findIndex(sp => sp.product.id === product.id);

        if (existingProductIndex !== -1) {
            const updatedSelectedProducts = [...selectedProducts];
            const selectedProduct = updatedSelectedProducts[existingProductIndex];
            const existingOptionIndex = selectedProduct.options.findIndex(op => op.id === option.id);

            if (existingOptionIndex !== -1) {
                selectedProduct.options = selectedProduct.options.filter(op => op.id !== option.id);

                if (selectedProduct.options.length === 0) {
                    updatedSelectedProducts.splice(existingProductIndex, 1); // Удаление продукта, если массив опций стал пустым
                }
            } else {
                selectedProduct.options.push(option);
            }

            setSelectedProducts(updatedSelectedProducts);
        } else {
            setSelectedProducts([...selectedProducts, { product, options: [option] }]);
        }
    };
    const handleProductClick = (product) => {
        if (selectedProducts.some(sp => sp.product.id === product.id)) {
            setSelectedProducts(selectedProducts.filter(sp => sp.product.id !== product.id));
        } else {
            setSelectedProducts([...selectedProducts, { product }]);
        }
    };

        const handleConfirmSelection = () => {
            console.log(selectedProducts);
            onHide();
        };

        return (
            <Modal show={show}
                   onHide={onHide}
                   centered>
                <Modal.Header>
                    <Modal.Title>Выберите продукты:</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Table striped bordered hover style={{borderCollapse: 'collapse', borderColor: 'transparent', borderBottom: '1px lightgrey'}}>
                        <thead>
                        <tr style={{textAlign: 'center'}}>
                            <th style={{fontWeight: '300', width: 20}}></th>
                            <th style={{fontWeight: '300', width: '60px'}}>Фото</th>
                            <th style={{fontWeight: '300', width: 400}}>Наименование</th>
                            <th style={{fontWeight: '300', width: 500}}>Вариант</th>
                        </tr>
                        </thead>
                        <tbody>
                        {products.map((product, index) => (
                            <React.Fragment key={product.id}>
                                {options.filter(op => op.productId === product.id).length > 0 ? (
                                    options.filter(op => op.productId === product.id).map(option => (
                                        <tr key={`${product.id}-${option.id}`} style={{ fontSize: '16px' }} onClick={() => handleProductOptionClick(product, option)} style={{ cursor: 'pointer' }}>
                                            <td style={{ textAlign: 'center', fontSize: '16px' }}>
                                                <Form.Check
                                                    type="checkbox"
                                                    checked={selectedProducts.some(sp => sp.product.id === product.id && sp.options.includes(option))}
                                                />
                                            </td>
                                            <td style={{ textAlign: 'center' }}><Image width={50} height={50} src={product.img} /></td>
                                            <td style={{ fontWeight: '400' }}>{product.name}</td>
                                            <td>{option.name}</td>
                                        </tr>
                                    ))) : (
                                    <tr key={product.id} style={{ fontSize: '16px' }} onClick={() => handleProductClick(product)} style={{ cursor: 'pointer' }}>
                                        <td style={{ textAlign: 'center', fontSize: '16px' }}>
                                            <Form.Check
                                                type="checkbox"
                                                checked={selectedProducts.some(sp => sp.product.id === product.id)}
                                            />
                                        </td>
                                        <td style={{ textAlign: 'center' }}><Image width={50} height={50} src={product.img} /></td>
                                        <td style={{ fontWeight: '400' }}>{product.name}</td>
                                        <td></td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                        </tbody>
                    </Table>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleConfirmSelection}>Подтвердить выбор</Button>
                </Modal.Footer>
            </Modal>
        )

};

export default SelectProducts;