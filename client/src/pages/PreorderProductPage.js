import React, {useState} from 'react';
import {Button, Col, Container, Image, OverlayTrigger, Row, Tooltip} from "react-bootstrap";
import QuantitySelector from "../components/QuantitySelector";
import {SHOP_ROUTE} from "../utils/consts";
import {useHistory} from "react-router-dom";
import {TfiClose} from "react-icons/tfi";

const PreorderProductPage = () => {
    const history = useHistory()
    const [preorderProduct, setPreorderProduct] = useState({
        id: 1,
        name: 'Goodal Houttuynia Cordata Calming Sun Cream SPF50+ PA++++',
        description: 'Глянцевый тинт для губ',
        price: 1200,
        img: 'https://optim.tildacdn.com/stor6263-6132-4864-b438-323866646436/-/format/webp/74012889.jpg',
        selectedOption: null
    });
    const option = [
        {id: 1, name: '01', productId: 1, img: 'https://optim.tildacdn.com/stor6364-3235-4134-b538-353130663633/-/format/webp/81928742.jpg'},
        {id: 2, name: '02', productId: 1, img: 'https://optim.tildacdn.com/stor6364-3235-4134-b538-353130663633/-/format/webp/81928742.jpg'},
        {id: 3, name: '03', productId: 1, img: 'https://optim.tildacdn.com/stor6364-3235-4134-b538-353130663633/-/format/webp/81928742.jpg'},
    ]
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
                            <Image width={470} height={470} src={preorderProduct.img}/>
                        </Col>
                        <Col md={5}>
                            <div style={{fontWeight: 500, fontSize: '22px'}} className="mt-2">
                                {preorderProduct.name}
                            </div>
                            <div style={{fontWeight: 500, fontSize: '22px', color: '#f3a0d5'}} className="mt-3">
                                {preorderProduct.price + ' р.'}
                            </div>
                            <div className="mt-4" style={{fontSize: '16px'}}>Версия</div>
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
                                                <Image width={50} height={50} src={info.img} style={{outline: 'solid', outlineWidth: 0.1, outlineColor: 'lightgrey',}}
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