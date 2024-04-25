import React, {useContext, useEffect, useState} from 'react';
import {Button, Col, Container, Image, OverlayTrigger, Row, Tooltip} from "react-bootstrap";
import QuantitySelector from "../components/QuantitySelector";
import {SHOP_ROUTE} from "../utils/consts";
import {useHistory, useLocation, useParams} from "react-router-dom";
import {TfiClose} from "react-icons/tfi";
import {Context} from "../index";
import {
    fetchCategories,
    fetchOneProduct,
    fetchPreorderProducts,
    fetchProducts,
    fetchPurchases
} from "../http/productAPI";

const PreorderProductPage = () => {
    const history = useHistory()
    const {product} = useContext(Context)
    const {id} = useParams()
    const [loading, setLoading] = useState(true);
    const [preorderProduct, setPreorderProduct] = useState('')

    useEffect(() => {
        Promise.all([
            fetchCategories(),
            fetchProducts(),
            fetchPurchases(),
            fetchPreorderProducts(),
            fetchOneProduct(id)
        ]).then(([categories, products, purchases, preorderProducts, preorderProduct]) => {
            product.setProducts(products);
            product.setPurchases(purchases);
            product.setPreorderProducts(preorderProducts);
            setPreorderProduct(preorderProduct)
            setLoading(false);
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
        i.id === optionIds[index]
    )
    const price = pr.find(i => i.id).price
    console.log(option)
    console.log(pr)

    const handleOptionSelect = (option) => {
        console.log(option.id);
        setPreorderProduct(prevState => ({
            ...prevState,
            selectedOption: option
        }));
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
                                    <QuantitySelector/>
                                </div>
                                <div style={{width: '120px'}}>
                                    <Button className="btn-6">Выбрать</Button>
                                </div>
                            </Row>
                            <Row>
                                <div style={{fontWeight: 200, fontSize: '18px', marginTop: '4%'}}>
                                    {preorderProduct.description}
                                </div>
                            </Row>


                        </Col>
                    </Row>

                </Container>
            </div>

        </div>

    );
};

export default PreorderProductPage;