import React, {useContext, useEffect, useState} from 'react';
import {Context} from "../../index";
import {useHistory} from "react-router-dom";
import {
    fetchCategories,
    fetchOptions,
    fetchPreorderProducts,
    fetchProducts,
    fetchPurchases
} from "../../http/productAPI";
import {PREORDER_PRODUCT_ROUTE} from "../../utils/consts";
import {Button, Col, Image, Modal, Row} from "react-bootstrap";
import QuantitySelector1 from "../QuantitySelector1";
import {TfiClose} from "react-icons/tfi";

const Order = ({show, onHide, selectedOrder}) => {
    const {client} = useContext(Context)
    const {product} = useContext(Context)
    const history = useHistory()
    const [loading, setLoading] = useState(true)
    const productOrder = client.ordersProduct.filter(i => i.orderId === selectedOrder.id)
    const [quantities, setQuantities] = useState({});
    let summa = 0
    let fullSumma = 0
    let delivery = selectedOrder.summaDelivery
    console.log(productOrder)
    const handleUpdateQuantity = (id, value) => {
        setQuantities(prevQuantities => ({
            ...prevQuantities,
            [id]: value
        }));
    };
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
    if (selectedOrder.statusOrder === 'Записан') {
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
    }

    console.log(product.preorderedProducts)

    const handleProduct = (i) => {
        onHide();
        history.push({
            pathname: `${PREORDER_PRODUCT_ROUTE}/${i.productId}`,
        })
    };
    console.log(selectedOrder)
    let statusStyle = { backgroundColor: "#f3a0d5", color: "white" };
    let summaOrderStyle = {color: '#f3a0d5'}
    let summaDeliveriStyle = {color: '#f3a0d5'}
    let summaDeliveriRFStyle = {color: '#f3a0d5'}
    switch (selectedOrder.statusOrder) {
        case 'Выполнен':
            statusStyle = { backgroundColor: "#99ff99", color: "white" };
            break;
        case 'Отменен':
            statusStyle = { backgroundColor: "lightgrey", color: "white" };
            summaOrderStyle = { color: 'lightgrey' };
            summaDeliveriStyle = { color: 'lightgrey' };
            summaDeliveriRFStyle = { color: 'lightgrey' };
            break;
        case 'Записан':
            summaOrderStyle = { color: 'black' };
            summaDeliveriStyle = { color: 'black' };
            summaDeliveriRFStyle = { color: 'black' };
            break;
        case 'Ожидает оплаты':
            statusStyle = { backgroundColor: "red", color: "white" };
            summaOrderStyle = { color: 'black' };
            summaDeliveriStyle = { color: 'black' };
            summaDeliveriRFStyle = { color: 'black' };
            break;
        case 'Оплачен':
        case 'Заказан у поставщика':
        case 'Получен на кор. адресе':
        case 'Отправлен в РФ':
        case 'Ожидает оформления доставки по РФ':
            statusStyle = { backgroundColor: "red", color: "white" };
            summaDeliveriRFStyle = { color: 'black' };
            break;
    }
    const date = new Date(selectedOrder.createdAt);
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const day = date.getDate();
    return (
        <Modal
            show={show}
            onHide={onHide}
            size='lg'
            style={{borderRadius: 0}}
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter" style={{display: 'flex', alignItems: 'center'}}>
                    <span style={{fontSize: '25px'}}>Заказ P-{year}{month}{selectedOrder.id}</span>
                    <span style={{...statusStyle, display: "inline-block", fontWeight: 400, textAlign: "center", borderRadius: '30px', fontSize: '14px', paddingLeft: '10px', paddingRight: '10px', marginLeft: '10px'}}>
                        {selectedOrder.statusOrder}</span>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {productOrder.map((i, index) => {
                    const preorderProduct = product.preorderProducts.find(j => j.id === i.preorderProductId)
                    let img = ''
                    if (preorderProduct.optionId) {
                        img = product.options.find(j => j.id === preorderProduct.optionId).img;
                    } else {
                        img = product.products.find(j => j.id === preorderProduct.productId).img;
                    }
                    const name = product.products.find(j => j.id === preorderProduct.productId).name
                    const desc = product.products.find(j => j.id === preorderProduct.productId).description
                    let option = ''
                    const price = preorderProduct.price
                    if (preorderProduct.optionId) {
                        option = product.options.find(j => j.id === preorderProduct.optionId).name
                    }
                    quantities[index] ? summa = summa + price * quantities[index] : summa = summa + price * i.quantity

                    return (
                        <div>
                            <Row key={i.id} style={{fontSize: '20px'}} className="mt-1">
                                <Col className='col-md-1 d-flex align-items-center'
                                     style={{cursor: "pointer", width: 120}} onClick={() => handleProduct(i)}><Image
                                    width={100} height={100} src={process.env.REACT_APP_API_URL + img}/></Col>
                                <Col className='col-md-5 justify-content-center' style={{cursor: "pointer", fontWeight: 400, fontSize: '18px'}}
                                     onClick={() => handleProduct(i)}>{name} <p style={{fontSize: '16 px', fontWeight: 300}}>{desc}</p>{preorderProduct.optionId ? <p
                                    style={{fontSize: '16px', fontWeight: 300}}>Версия: {option}</p> : ''}</Col>
                                <Col className='col-md-2 d-flex align-items-center'> {selectedOrder.statusOrder === 'Записан' ? <QuantitySelector1 id={index}
                                                                                                        onUpdate={handleUpdateQuantity} quantitie={i.quantity}/> : <span style={{fontSize: '18px'}}>{i.quantity} шт </span>}
                                </Col>
                                <Col style={{fontSize: '18px'}}
                                     className='col-md-2 d-flex align-items-center'><span>{quantities[index] ? price * quantities[index] + ' р.' : price*i.quantity + ' р.'}</span></Col>
                                <Col className='col-md-1 d-flex align-items-center'>{selectedOrder.statusOrder === 'Записан' ? <div className="circle">
                                    <TfiClose style={{width: '10px', color: 'grey'}}/></div> : ''}</Col>
                                    </Row>
                        </div>

                    );
                })}
                <div className='border-top'></div>
                <Row className="d-flex justify-content-end mt-4" style={{fontWeight: 300, marginRight: '2px', fontSize: '16px'}}>Сумма: {summa} р.</Row>
                <Row className="d-flex justify-content-end" style={{fontWeight: 300, marginRight: '2px', fontSize: '16px'}}>Доставка до РФ: {selectedOrder.summaDeliveryInRU ? selectedOrder.summaDeliveryInRU + ' р.' : '―'}</Row>
                <Row className="d-flex justify-content-end" style={{fontWeight: 300, marginRight: '2px', fontSize: '16px'}}>Доставка по РФ: {delivery ? delivery + ' p.' : '―'}</Row>
                <Row className="d-flex justify-content-end" style={{fontWeight: 400, marginRight: '2px', fontSize: '23px'}}>Итоговая сумма: {summa+selectedOrder.summaDelivery+delivery ? summa+selectedOrder.summaDelivery+delivery + ' р.' : '―'} </Row>
                {selectedOrder.statusOrder === 'Записан' ? <Row className='d-flex justify-content-center mt-4'><Button className="btn-2">Отменить заказ</Button></Row> : ''}
                {selectedOrder.statusOrder === 'Ожидает оформления доставки по РФ' ? <Row className='d-flex justify-content-center mt-4'><Button className="btn-2" style={{color: "red"}}>Оформить доставку</Button></Row> : ''}
                {selectedOrder.statusOrder === 'Ожидает оплаты' ? <Row className='d-flex justify-content-center mt-4'><Button className="btn-2" style={{color: "red"}}>Оплатить заказ</Button></Row> : ''}

            </Modal.Body>

        </Modal>
    );
};

export default Order;