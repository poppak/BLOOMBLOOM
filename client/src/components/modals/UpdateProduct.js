import React, {useContext, useEffect, useState} from 'react';
import {Button, Col, Dropdown, DropdownMenu, DropdownToggle, Form, Image, Modal, Row} from "react-bootstrap";
import {Context} from "../../index";
import {fetchCategories, fetchOptions, fetchProducts} from "../../http/productAPI";

const UpdateProduct = ({show, onHide, selectedProduct }) => {
    const {product} = useContext(Context)
    useEffect(() => {
        fetchOptions().then(data => product.setOptions(data))
    }, []);
    const [selectedCategory, setSelectedCategory] = useState(selectedProduct ? selectedProduct.category : '');
    const [option, setOption] = useState([])
    const cat = product.categories
    const options = product.options
    const optionsProduct = options.filter(op => op.productId === selectedProduct.id)
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
    const handleSave = () => {
        // Логика сохранения изменений на сервере
        // Например, вызов метода для обновления продукта
        // updateProduct(editedProduct);
    };
    return (
        <Modal
            show={show}
            onHide={onHide}
            size="lg"
            centered
        >
            <Modal.Header>
                <Modal.Title id="contained-modal-title-vcenter">
                    Товар {selectedProduct.name}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Control className="mt-2" placeholder={"Наименование товара"} defaultValue={selectedProduct.name}  />
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
                        <Form.Control style={{width: 150}} placeholder={selectedCategory ? selectedCategory : cat.find(category => category.id === selectedProduct.categoryId)?.name || ''}  readOnly />
                    </Row>
                    <Col className="d-flex justify-content-center mt-2" style={{textAlign: 'center', alignItems: 'center', fontWeight: 300, color: 'red'}}> Выберите изображение, если хотите его заменить </Col>
                    <Form.Control className="mt-2" type="file"/>

                    <Form.Control
                        as="textarea"
                        rows={1}
                        className="mt-2"
                        placeholder={"Описание товара"}
                        defaultValue={selectedProduct.description}
                    />
                    <Form.Control
                        as="textarea"
                        rows={3}
                        className="mt-2"
                        placeholder={"Подробное описание товара"}
                        value={selectedProduct.fullDescription}

                    />
                   <Col className='d-flex' style={{textAlign: "center", alignSelf: "flex-end"}}>
                       <Form.Control
                           type='number'
                           style={{width: '100px'}}
                           className="mt-2"
                           placeholder={"Объем"}
                           value={selectedProduct.volumeProduct}
                       /><p style={{textAlign: "center", lineHeight: '0px', alignSelf: "flex-end", marginLeft: 10, fontSize: '20px', fontWeight: 400}}>см³</p>
                   </Col>
                    <hr/>
                    <Row className="justify-content-center">
                        <Button className="btn-5"
                                style={{width: '40%', height: 40, fontSize: '18px', fontWeight:400}}
                                onClick={addOption}
                        >
                            Добавить версию товара
                        </Button>
                    </Row>
                    <Col className="d-flex justify-content-center mt-2" style={{textAlign: 'center', alignItems: 'center', fontWeight: 300, color: 'red'}}> Выберите изображение, если хотите его заменить </Col>
                    {optionsProduct && optionsProduct.map(i =>
                        <Row className="mt-2" key={i.id}>
                            <Col md={6}>
                                <Form.Control
                                    placeholder={"Название варианта"}
                                    defaultValue={i.name}
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
                    {option && option.map(i =>
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
                <Button onClick={onHide} style={{color: '#f3a0d5', fontWeight:400}}>Обновить</Button>
            </Modal.Footer>
        </Modal>
    )
};

export default UpdateProduct;