import React, {useContext, useEffect, useState} from 'react';
import {Button, Col, Image, Modal, Row, Table} from "react-bootstrap";
import {Context} from "../../index";
import {
    createOrder,
    createPurchase, deleteBasketProduct,
    fetchBasketProducts, fetchBaskets,
    fetchCategories,
    fetchOptions,
    fetchPreorderProducts,
    fetchProducts,
    fetchPurchases, sendEmailNotification
} from "../../http/productAPI";
import {PREORDER_PRODUCT_ROUTE} from "../../utils/consts";
import {useHistory} from "react-router-dom";
import QuantitySelector1 from "../QuantitySelector1";
import {TfiClose} from "react-icons/tfi";
import {check} from "../../http/userAPI";

const Basket = ({show, onHide}) => {
    const {user} = useContext(Context)
    const {client} = useContext(Context)
    const {product} = useContext(Context)
    const history = useHistory()
    const [loading, setLoading] = useState(true)
    const [userInfo, setUserInfo] = useState({})
    const [quantities, setQuantities] = useState({});
    const [orderProducts, setOrderProducts] = useState([]);
    const [basketVisible, setBasketVisible] = useState(false)
    let summa = 0
    let delivery = 1070

    const handleUpdateQuantity = (id, value) => {
        setQuantities(prevQuantities => ({
            ...prevQuantities,
            [id]: value
        }));
    };
    useEffect(() => {
        Promise.all([
            check(),
            fetchCategories(),
            fetchProducts(),
            fetchPurchases(),
            fetchPreorderProducts(),
            fetchOptions(),
            fetchBaskets(),
            fetchBasketProducts(),
        ]).then(([user, categories, products, purchases, preorderProducts, options, baskets, basketProducts]) => {
            setUserInfo(user);
            product.setCategories(categories);
            product.setProducts(products);
            product.setFilteredProducts(products);
            product.setPurchases(purchases);
            product.setPreorderProducts(preorderProducts);
            product.setOptions(options);
            client.setBaskets(baskets);
            client.setBasketProducts(basketProducts);
            setLoading(false);
        }).catch(error => {
            console.error('Error loading data:', error);
            setLoading(false);
        });
    }, [product, client]);
    if (loading) {
        return <div>Loading...</div>;
    }
    if (user._isAuth) {
        let basket = client.baskets.find(b => b.userId === userInfo.id)
        let productBasket = client.basketProducts.filter(i => i.basketId === basket.id)
        const purchase = product.purchases.find(pur => pur.statusPurchase === "Запись открыта").id
        product.preorderProducts.forEach((preorderProduct) => {
            if (preorderProduct.purchaseId === purchase) {
                const productToAdd = product.products.find(prod => prod.id === preorderProduct.productId);
                if (productToAdd && !product.preorderedProducts.some(p => p.id === productToAdd.id)) {
                    const extendedProduct = {
                        ...productToAdd,
                        price: preorderProduct.price,
                        purchaseId: preorderProduct.purchaseId,
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

        const addOrderProduct = (i) => {
            const preorderProductId = product.preorderProducts.find(p => p.productId === i.productId && p.optionId === i.optionId && p.purchaseId === purchase).id;

            // Проверяем, есть ли уже продукт с таким preorderProductId
            const existingProductIndex = orderProducts.findIndex(product => product.preorderProductId === preorderProductId);

            if (existingProductIndex !== -1) {
                return product;
            } else {
                // Если продукта с таким preorderProductId нет, добавляем новый продукт
                const newProduct = {
                    preorderProductId: preorderProductId,
                    quantity: i.quantity,
                    purchaseId: purchase,
                };
                setOrderProducts(prevProducts => [...prevProducts, newProduct]);
            }
        }

        const handleProduct = (i) => {
            onHide();
            history.push({
                pathname: `${PREORDER_PRODUCT_ROUTE}/${i.productId}`,
            })
        };
        console.log(productBasket)
        const deleteBasketPr = (id) => {
            deleteBasketProduct(id)
                .then((data) => {
                    console.log("Продукт успешно удален из корзины", data);
                    show = basketVisible
                    onHide = setBasketVisible(false)
                    fetchBasketProducts().then(data => {
                        client.setBasketProducts(data);
                        setBasketVisible(true)
                    });
                })
                .catch((error) => {
                    console.error("Ошибка при удалении продукта из корзины", error);
                });
        };


        const addOrder = () => {
            const formData = new FormData()
            formData.append('statusOrder', 'Записан')
            formData.append('userId', userInfo.id)
            formData.append('purchaseId', purchase)
            formData.append('summaOrder', `${summa}`)
            formData.append('summaDeliveryInRU', `${delivery}`)
            formData.append('orderProducts', JSON.stringify(orderProducts))
            createOrder(formData).then(data => {
                productBasket.map(i => deleteBasketProduct(i.id));
                fetchBasketProducts().then(data => {
                    onHide()
                    client.setBasketProducts(data)
                })
            });
        }

        return (
            <Modal
                show={show}
                onHide={onHide}
                size='lg'
                style={{marginLeft: '30%', width: "40%", borderRadius: 0}}
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Корзина
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {productBasket.map((i,index) => {
                        addOrderProduct(i)
                        let img = ''
                        if (i.optionId) {
                            img = product.options.find(j => j.id === i.optionId).img;
                        } else {
                            img = product.products.find(j => j.id === i.productId).img;
                        }

                        const name = product.preorderedProducts.find(j => j.id === i.productId).name
                        let option = ''
                        const price = product.preorderedProducts.find(j => j.id === i.productId).price
                        if (i.optionId) {
                            option = product.options.find(j => j.id === i.optionId).name
                        }
                        if (quantities[index]) {
                            orderProducts[index].quantity = quantities[index];
                            summa = summa + price * quantities[index];
                        } else {
                            summa = summa + price * i.quantity;
                        }
                        return (
                            <div>
                                <Row key={i.id} style={{fontSize: '20px'}} className="mt-1">
                                    <Col className='col-md-1 d-flex align-items-center'
                                         style={{cursor: "pointer", width: 80}} onClick={() => handleProduct(i)}><Image
                                        width={60} height={60} src={process.env.REACT_APP_API_URL + img}/></Col>
                                    <Col className='col-md-5 justify-content-center' style={{cursor: "pointer", fontWeight: 400, fontSize: '18px'}}
                                         onClick={() => handleProduct(i)}>{name} {i.optionId ? <p
                                        style={{fontSize: '16px', fontWeight: 300}}>Версия: {option}</p> : ''}</Col>
                                    <Col className='col-md-2 d-flex align-items-center'> <QuantitySelector1 id={index}
                                                                                                            onUpdate={handleUpdateQuantity} quantitie={i.quantity}/>
                                    </Col>
                                    <Col style={{fontSize: '18px'}}
                                         className='col-md-2 d-flex align-items-center'>{quantities[index] ? price * quantities[index] + ' р.' : price*i.quantity + ' р.'}</Col>
                                    <Col className='col-md-1 d-flex align-items-center'><div className="circle" onClick={() => deleteBasketPr(i.id)}><TfiClose style={{width: '10px', color: 'grey'}}/></div></Col>
                                </Row>
                            </div>

                        );
                    })}
                    <div className='border-top'></div>
                    <Row className="d-flex justify-content-end mt-4" style={{fontWeight: 300, marginRight: '2px', fontSize: '16px'}}>Сумма: {summa} р.</Row>
                    <Row className="d-flex justify-content-end" style={{fontWeight: 300, marginRight: '2px', fontSize: '16px'}}>Доставка до РФ: {delivery} р.</Row>
                    <Row className="d-flex justify-content-end" style={{fontWeight: 400, marginRight: '2px', fontSize: '23px'}}>Итоговая сумма: {summa+delivery} р.</Row>
                    <Row className='d-flex justify-content-center mt-4'><Button className="btn-2" onClick={addOrder}>Участвовать</Button></Row>
                </Modal.Body>

            </Modal>
        );
    }

};

export default Basket;