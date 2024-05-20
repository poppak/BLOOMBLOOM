import React, {useContext, useEffect, useState} from 'react';
import {Button, Col, Container, Image, OverlayTrigger, Row, Tooltip} from "react-bootstrap";
import QuantitySelector from "../components/QuantitySelector";
import {SHOP_ROUTE} from "../utils/consts";
import {useHistory, useParams} from "react-router-dom";
import {TfiClose} from "react-icons/tfi";
import {Context} from "../index";
import {
    createBasketProduct, fetchBasketProducts,
    fetchBaskets,
    fetchOneProduct,
    fetchPreorderProducts,
    fetchProducts,
    fetchPurchases
} from "../http/productAPI";
import {check} from "../http/userAPI";
import Basket from "../components/modals/Basket";

const PreorderProductPage = () => {
    const history = useHistory()
    const {product} = useContext(Context)
    const {client} = useContext(Context)
    const {id} = useParams()
    const [user, setUser] = useState({})
    const [loading, setLoading] = useState(true);
    const [preorderProduct, setPreorderProduct] = useState('')
    const [quantitie, setQuantitie] = useState(1);
    const [basketVisible, setBasketVisible] = useState(false)
    const handleUpdateQuantity = (value) => {
        setQuantitie(value);
    };

    const handleOptionSelect = (option) => {
        setPreorderProduct(prevState => ({
            ...prevState,
            selectedOption: option
        }));
    }

    useEffect(() => {
        Promise.all([
            check(),
            fetchProducts(),
            fetchPurchases(),
            fetchPreorderProducts(),
            fetchOneProduct(id),
            fetchBaskets(),
            fetchBasketProducts(),
        ]).then(([user, products, purchases, preorderProducts, preorderProduct, baskets, basketProducts]) => {
            setUser(user);
            product.setProducts(products);
            product.setPurchases(purchases);
            product.setPreorderProducts(preorderProducts);
            setPreorderProduct(preorderProduct);
            client.setBaskets(baskets);
            client.setBasketProducts(basketProducts)
            setLoading(false);
            if (!preorderProduct.selectedOption && preorderProduct.options.length > 0) {
                const defaultOption = preorderProduct.options[0];
                setPreorderProduct(prevState => ({
                    ...prevState,
                    selectedOption: defaultOption
                }));
            }
        }).catch(error => {
            console.error('Error loading data:', error);
            setLoading(false);
        });
    }, [product]);

    if (loading) {
        return <div>Loading...</div>;
    }

    const pr = product.preorderProducts.filter(i =>
            (i.purchaseId === product.purchases.find(i => i.statusPurchase === 'Запись открыта').id)
            && (i.productId === preorderProduct.id)
    )

    const optionIds = pr.map(i => i.optionId)
    const option = preorderProduct.options.filter((i, index) =>
        optionIds.find(j => j === i.id)
    )
    const price = pr.find(i => i.id).price
    console.log(optionIds)
    console.log(pr)


    const selectedOp = preorderProduct.selectedOption
    let selectedOpId
    if (selectedOp) {
        selectedOpId = selectedOp.id;
    } else {
        console.log("Ни одна опция не выбрана");
    }
    const basket = client.baskets.find(b => b.userId === user.id)

    const addBasketProduct = () => {
        const formData = new FormData()
        formData.append('basketId', basket.id)
        formData.append('productId', preorderProduct.id)
        if (selectedOpId) {
            formData.append('optionId', selectedOpId)
        }
        formData.append('quantity', quantitie)
        createBasketProduct(formData).then(data => {
            fetchBasketProducts().then(data => {
                client.setBasketProducts(data)
                setBasketVisible(true)
            })
        })

    }

    return (
        <div className="pageBackground scrollable-content">
            <div>
                <Row style={{width: '100%'}}>
                    <div className="d-flex" style={{width: '49%'}}>
                        <Button onClick={() => history.push(SHOP_ROUTE)} className="btn-5 mt-4">
                            ← Вернуться
                        </Button>
                    </div>
                    <div className="d-flex justify-content-end" style={{width: '50%'}}>
                        <Button onClick={() => history.push(SHOP_ROUTE)} className="btn-4 mt-4">
                            <TfiClose  style={{width:28, height: 28, marginRight:'1%' }}/>
                        </Button>
                    </div>

                </Row>
                <Container style={{marginTop: '5.5%'}}>
                    <Row>
                        <Col md={6} style={{textAlign: 'right', paddingRight: '30px'}}>
                            <Image width={470} height={470} src={process.env.REACT_APP_API_URL + preorderProduct.img}/>
                        </Col>
                        <Col md={5}>
                            <div style={{fontWeight: 500, fontSize: '22px'}} className="mt-2">
                                {preorderProduct.name}
                            </div>
                            <div style={{fontWeight: 500, fontSize: '22px', color: '#f3a0d5'}} className="mt-3">
                                {price + ' р.'}
                            </div>
                            {option === [] ? <div className="mt-4" style={{fontSize: '16px'}}>Версия</div> : ''}
                            {console.log(option)}
                            <Row>

                                {option.map(info =>
                                    <Col className="mt-1" md={2} style={{width: 60, cursor: 'pointer'}}>
                                        <OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip-2">{info.name}</Tooltip>}>
                                            <div style={{width: '60px', height: '60px', outlineColor: 'lightgrey',
                                                border: `1px solid ${info.id === preorderProduct.selectedOption?.id ? 'black' : 'transparent'}`,
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center'
                                            }}>
                                                <Image width={50} height={50} src={process.env.REACT_APP_API_URL + info.img} style={{outline: 'solid', outlineWidth: 0.1, outlineColor: 'lightgrey',}}
                                                       key={info.id}
                                                       onClick={() => handleOptionSelect(info)}/>
                                            </div>
                                        </OverlayTrigger>
                                    </Col>
                                )}
                            </Row>
                            <Row className="mt-2 d-flex align-items-center">
                                <div style={{width: '120px', marginBottom: '16px'}}>
                                    <QuantitySelector onUpdate={handleUpdateQuantity}/>
                                </div>
                                <div style={{width: '120px'}}>
                                    <Button className="btn-6" onClick={addBasketProduct}>Выбрать</Button>
                                </div>
                            </Row>
                            <Row>
                                <div style={{fontWeight: 200, fontSize: '18px', marginTop: '4%'}}>
                                    {preorderProduct.fullDescription}
                                </div>
                            </Row>



                        </Col>
                    </Row>

                </Container>
            </div>
            <Basket show={basketVisible} onHide={() => setBasketVisible(false)}></Basket>
        </div>

    );
};

export default PreorderProductPage;