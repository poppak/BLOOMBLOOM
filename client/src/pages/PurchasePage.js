import React, {useContext, useState} from 'react';
import {Context} from "../index";
import {Button, Container, Dropdown, DropdownButton, Row} from "react-bootstrap";
import PurchaseList from "../components/PurchaseList";
import CreateProduct from "../components/modals/CreateProduct";
import CreatePurchase from "../components/modals/CreatePurchase";

const PurchasePage = () => {
    const {product} = useContext(Context)
    const [productVisible, setProductVisible] = useState(false)

    return (
        <Container>
            <Row>
                <h1 style={{textAlign: 'center', marginTop: '4%', marginBottom: '4%'}}>Совместные закупки</h1>
            </Row>
            <PurchaseList/>
            <Row className="d-flex justify-content-center">
                <Button
                    className="btn-6"
                    style={{width: 130, height: 40, fontSize: '18px'}}
                    onClick={() => setProductVisible(true)}
                >Добавить</Button>
            </Row>
            <CreatePurchase show={productVisible} onHide={() => setProductVisible(false)}/>
        </Container>
    );
};

export default PurchasePage;