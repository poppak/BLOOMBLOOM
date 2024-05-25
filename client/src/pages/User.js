import React, {useContext, useEffect, useState} from 'react';
import {
    fetchCategories,
    fetchOrders,
    fetchOrdersProduct,
    fetchPreorderProducts,
    fetchProducts,
    fetchPurchases
} from "../http/productAPI";
import {Context} from "../index";
import {check} from "../http/userAPI";
import {Button, Card, Col, Container, Image, OverlayTrigger, Row, Tooltip} from "react-bootstrap";
import {IoIosInformationCircleOutline} from "react-icons/io";
import CreateProduct from "../components/modals/CreateProduct";
import Order from "../components/modals/Order";

const User = () => {
    const { product } = useContext(Context);
    const {client} = useContext(Context)
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState({})
    const [orderVisible, setOrderVisible] = useState(false)
    const [selectedOrderIndex, setSelectedOrderIndex] = useState(null);

    useEffect(() => {
        Promise.all([
            check(),
            fetchCategories(),
            fetchProducts(),
            fetchPurchases(),
            fetchPreorderProducts(),
            fetchOrders(),
            fetchOrdersProduct()
        ]).then(([user, categories, products, purchases, preorderProducts, orders, ordersProduct]) => {
            setUser(user);
            product.setCategories(categories);
            product.setProducts(products);
            product.setFilteredProducts(products);
            product.setPurchases(purchases);
            product.setPreorderProducts(preorderProducts);
            client.setOrders(orders);
            client.setOrdersProduct(ordersProduct);
            setLoading(false);
        }).catch(error => {
            console.error('Error loading data:', error);
            setLoading(false);
        });
    }, [product]);

    if (loading) {
        return <div>Loading...</div>;
    }
    const handleOrderClick = (index) => {
        setSelectedOrderIndex(index);
        setOrderVisible(true);
    };
    const orders = client.orders.filter(i => i.userId === user.id)

    let monthNames = ["янв", "фев", "мар", "апр", "мая", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"];
    return (
        <Container className="mt-4">
            <a style={{fontWeight: 400, color: '#f3a0d5'}}>{user.name}</a>
            <h1 className="mt-4">Мои заказы</h1>
            {orders.map((i, index) => {
                let statusStyle = { backgroundColor: "#f3a0d5", color: "white" };
                let summaOrderStyle = {color: '#f3a0d5'}
                let summaDeliveriStyle = {color: '#f3a0d5'}
                let summaDeliveriRFStyle = {color: '#f3a0d5'}
                switch (i.statusOrder) {
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
                    case 'Ожидает оформления доставки по РФ':
                        statusStyle = { backgroundColor: "red", color: "white" };
                        summaDeliveriRFStyle = { color: 'black' };
                        break;
                }
                const date = new Date(i.createdAt);
                console.log(date)
                const month = date.getMonth() + 1;
                const year = date.getFullYear();
                const day = date.getDate();
                const productsInOrder = client.ordersProduct.filter(j => j.orderId === i.id)
                let quantityFull = 0


                return (
                    <div key={i.id} style={{cursor: "pointer"}} className='border-bottom d-flex' onClick={() => handleOrderClick(index)}>
                        <Col className='col-md-4'>
                            <Row className="mt-3 d-flex justify-content-start">
                                <Col className="col-md-3">
                                    <div className="d-flex" style={{width: '200px'}}>
                                        P-{year}{month}{i.id}
                                    </div>
                                    <div style={{
                                        fontWeight: 600,
                                        width: '100px',
                                        fontSize: '22px'
                                    }}>{`${day} ${monthNames[month - 1]} `}</div>
                                </Col>
                                <Col className='col-md-9'>
                                    <div style={{
                                        ...statusStyle,
                                        display: "inline-block",
                                        fontWeight: 400,
                                        textAlign: "center",
                                        borderRadius: '30px',
                                        fontSize: '14px',
                                        paddingLeft: '10px',
                                        paddingRight: '10px'
                                    }}>{i.statusOrder}
                                    </div>


                                </Col>

                            </Row>


                        </Col>
                        <Col className="col-md-4">
                            {productsInOrder.map(pr => {
                                quantityFull = quantityFull + pr.quantity
                            })}
                            <div className="mt-3" style={{
                                fontWeight: 200,
                                width: '80px',
                                fontSize: '14px'
                            }}>Состав/{quantityFull} шт</div>
                            {productsInOrder.map(pr => {
                                let img
                                product.preorderProducts.find(x => x.id === pr.preorderProductId).optionId ?
                                    img = product.options.find(p => p.id === product.preorderProducts.find(x => x.id === pr.preorderProductId).optionId).img
                                    :
                                    img = product.products.find(p => p.id === product.preorderProducts.find(x => x.id === pr.preorderProductId).productId).img
                                return (
                                    <Image
                                        className='mb-1' style={{marginRight: 8}} width={60} height={60} src={process.env.REACT_APP_API_URL + img}/>
                                )
                            })}

                        </Col>
                        <Col className="col-md-1 mt-4" style={{fontSize: '14px', fontWeight: 300, alignItems: "center", textAlign: 'right'}}>
                            cумма заказа
                            {/*<span style={{color: 'transparent'}}>по рф</span>*/}
                            <p style={{...summaOrderStyle, fontWeight: 400,fontSize: '20px'}}>{i.summaOrder} р.</p>

                        </Col>
                        <Col className="col-md-1 mt-4" style={{paddingLeft: '10px', fontSize: '14px', fontWeight: 300, alignItems: "center", textAlign: 'right'}}>
                            доставка до РФ
                            {i.summaDeliveryInRU ? <p style={{...summaDeliveriStyle, fontWeight: 400, fontSize: '20px'}}>{i.summaDeliveryInRU} р.</p> : ''}

                        </Col>
                        <Col className="col-md-1 mt-4" style={{paddingLeft: '10px', fontSize: '14px', fontWeight: 300, alignItems: "center", textAlign: 'right'}}>
                            доставка по РФ
                            {i.summaDelivery ? <p style={{...summaDeliveriRFStyle, fontWeight: 400, fontSize: '20px'}}>{i.summaDelivery} р.</p> : ''}

                        </Col>
                        <Col className="col-md-1 mt-4" style={{paddingLeft: '10px', fontSize: '14px', fontWeight: 300, alignItems: "center", textAlign: 'right'}}>
                            {i.statusOrder === 'Ожидает оплаты' ?
                                <OverlayTrigger
                                    placement="bottom"
                                    overlay={<Tooltip>Необходимо оплатить заказ</Tooltip>}
                                >
                                    <div style={{ color: "red", width: "20px", height: "20px" }}>
                                        <IoIosInformationCircleOutline
                                            style={{ color: "red", width: "20px", height: "20px" }}
                                        />
                                    </div>

                                </OverlayTrigger>
                                :
                                i.statusOrder === 'Ожидает оформления доставки по РФ' ?
                                    <OverlayTrigger
                                        placement="bottom"
                                        overlay={<Tooltip>Необходимо оформить доставку по РФ</Tooltip>}
                                    >
                                        <div style={{ color: "red", width: "20px", height: "20px" }}>
                                            <IoIosInformationCircleOutline
                                                style={{ color: "red", width: "20px", height: "20px" }}
                                            />
                                        </div>

                                    </OverlayTrigger>
                                    : ''}

                        </Col>


                    </div>
                );
                }
            )}
            <Order show={orderVisible} onHide={() => setOrderVisible(false)} selectedOrder={selectedOrderIndex !== null ? orders[selectedOrderIndex] : {}}/>
        </Container>
    );
};

export default User;