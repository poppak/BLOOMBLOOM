import React, {useContext, useState} from 'react';
import {Button, Col, Dropdown, DropdownMenu, DropdownToggle, Form, Modal, Row} from "react-bootstrap";
import {Context} from "../../index";

const CreateProduct = ({show, onHide}) => {
    const {product} = useContext(Context)
    const [selectedCategory, setSelectedCategory] = useState('');
    const [option, setOption] = useState([])
    const addOption = () => {
        setOption([...option, {name: '', img: '', number: Date.now()}])
    }
    const removeOption = (number) => {
        setOption(option.filter(i => i.number !== number))
    }
    const handleClose = () => {
        setSelectedCategory('')
        setOption([]);
        onHide();
    };

    const handleSelectCategory = (categoryName) => {
        setSelectedCategory(categoryName);
    };
    return (
        <Modal
            show={show}
            onHide={onHide}
            size="lg"
            centered
            closeButton={false}
        >
            <Modal.Header>
                <Modal.Title id="contained-modal-title-vcenter">
                    Добавить товар
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Control className="mt-2" placeholder={"Наименование товара"}/>
                    <Row className="mt-2">
                        <Dropdown style={{width: 170}}>
                            <DropdownToggle>Категория товара</DropdownToggle>
                            <DropdownMenu>
                                {product.categories.map(category => (
                                    <Dropdown.Item
                                        style={{fontWeight: 200}}
                                        key={category.id}
                                        onClick={() => handleSelectCategory(category.name)}
                                    >
                                        {category.name}
                                    </Dropdown.Item>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
                        <Form.Control style={{width: 150}} placeholder={selectedCategory} readOnly />
                    </Row>
                    <Form.Control className="mt-2" type="file"/>
                    <Form.Control
                        as="textarea"
                        rows={1}
                        className="mt-2"
                        placeholder={"Описание товара"}/>
                    <hr/>
                    <Row className="justify-content-center">
                        <Button className="btn-5"
                                style={{width: '40%', height: 40, fontSize: '18px', fontWeight:400}}
                                onClick={addOption}
                        >
                            Добавить версию товара
                        </Button>
                    </Row>
                    {option.map(i =>
                        <Row className="mt-2" key={i.number}>
                            <Col md={6}>
                                <Form.Control
                                    placeholder={"Название варианта"}
                                />
                            </Col>
                            <Col md={5}>
                                <Form.Control
                                    type="file"
                                />
                            </Col>
                            <Col md={1}>
                                <Button className="btn-2" style={{width: '10%', fontSize: '18px', fontWeight:400, color: 'red'}} onClick={() => removeOption(i.number)}>
                                    X
                                </Button>
                            </Col>
                        </Row>
                    )}

                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={handleClose} style={{fontWeight:400}}>Закрыть</Button>
                <Button onClick={onHide} style={{color: '#f3a0d5', fontWeight:400}}>Добавить</Button>
            </Modal.Footer>
        </Modal>
    )
};

export default CreateProduct;