import React, {useContext, useEffect, useState} from 'react';
import {
    fetchCategories,
    fetchOptions,
    fetchPreorderProducts,
    fetchProducts,
    fetchPurchases, updateOrder
} from "../../http/productAPI";
import {Context} from "../../index";
import {useHistory} from "react-router-dom";
import {Button, Col, Form, Image, Modal, Row} from "react-bootstrap";


const Payment = ({show, onHide, order}) => {
    const {client} = useContext(Context)
    const {product} = useContext(Context)
    const history = useHistory()
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        Promise.all([
            fetchCategories(),
            fetchProducts(),
            fetchPurchases(),
            fetchPreorderProducts(),
            fetchOptions()
        ]).then(([categories, products, purchases, preorderProducts, options]) => {
            product.setCategories(categories);
            product.setProducts(products);
            product.setFilteredProducts(products);
            product.setPurchases(purchases);
            product.setPreorderProducts(preorderProducts);
            product.setOptions(options);
            setLoading(false);
        }).catch(error => {
            console.error('Error loading data:', error);
            setLoading(false);
        });
    }, [product]);
    if (loading) {
        return <div>Loading...</div>;
    }
    const date = new Date(order.createdAt);
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const updOrder = () => {
        updateOrder(order.id, order, 'Оплачен');
        window.location.reload(true)
    }
    return (
        <Modal
            show={show}
            onHide={onHide}
            size='md'
            style={{borderRadius: 0}}
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter" style={{display: 'flex', alignItems: 'center'}}>
                    <span style={{fontSize: '25px'}}>Оплата заказа P-{year}{month}{order.id}</span>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row style={{margin: 5}}>
                    <h5 style={{fontWeight:200}}>К оплате: <span style={{fontWeight:400}}>{order.summaOrder + order.summaDeliveryInRU} р.</span></h5>
                    <Form.Control className="mt-2" placeholder={"Номер карты"}></Form.Control>
                    <Form.Control className="mt-2" placeholder={"Срок действия"}
                                  style={{width: '48%', marginRight: '4%'}}></Form.Control>
                    <Form.Control className="mt-2" placeholder={"CVV / CVC"} style={{width: '48%'}}></Form.Control>
                </Row>

            </Modal.Body>
            <Modal.Footer>
                <Button className='btn-2' onClick={() => updOrder()}>Оплатить</Button>
            </Modal.Footer>

        </Modal>
    );
};

export default Payment;