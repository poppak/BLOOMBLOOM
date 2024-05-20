import React, {useContext, useEffect, useState} from 'react';
import {Button, Col, Dropdown, DropdownMenu, DropdownToggle, Form, Modal, Row} from "react-bootstrap";
import {Context} from "../../index";
import {createProduct, fetchCategories, fetchProducts} from "../../http/productAPI";
import {observer} from "mobx-react-lite";
import {values} from "mobx";
import {create} from "axios";
import {selectOptions} from "@testing-library/user-event/dist/select-options";

const CreateProduct = observer(({show, onHide}) => {
    const {product} = useContext(Context)
    useEffect(() => {
        fetchProducts().then(data => product.setProducts(data))
        fetchCategories().then(data => product.setCategories(data))
    }, []);
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [fullDescription, setFullDescription] = useState('')
    const [volumeProduct, setVolumeProduct] = useState('')
    const [file, setFile] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('');
    const [option, setOption] = useState([])
    const changeOption = (key, value, number) => {
        setOption(option.map(i => i.number === number ? {...i, [key]: value} : i));
    }
    const selectFile = (e) => {
        setFile(e.target.files[0])
    }

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
    const addProduct = () => {
        const formData = new FormData()
        formData.append('name', name)
        formData.append('description', description)
        formData.append('fullDescription', fullDescription)
        formData.append('volumeProduct', volumeProduct)
        formData.append('img', file)
        formData.append('categoryId', selectedCategory.id)
        option.forEach((opt, index) => {
            formData.append(`optionImg${index}`, opt.img);
        });

        formData.append('options', JSON.stringify(option))
        console.log(option)
        createProduct(formData).then(data => onHide())
    }
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
                    <Form.Control className="mt-2" placeholder={"Наименование товара"} value={name}
                                  onChange={e => setName(e.target.value)}/>
                    <Row className="mt-2">
                        <Dropdown style={{width: 170}}>
                            <DropdownToggle>Категория товара</DropdownToggle>
                            <DropdownMenu>
                                {product.categories.map(category => (
                                    <Dropdown.Item
                                        style={{fontWeight: 200}}
                                        key={category.id}
                                        onClick={() => handleSelectCategory(category)}
                                    >
                                        {category.name}
                                    </Dropdown.Item>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
                        <Form.Control style={{width: 150}} placeholder={selectedCategory.name} readOnly/>
                    </Row>
                    <Form.Control className="mt-2" type="file" onChange={selectFile}/>
                    <Form.Control
                        as="textarea"
                        rows={1}
                        className="mt-2"
                        placeholder={"Описание товара"}
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                    />
                    <Form.Control
                        as="textarea"
                        rows={3}
                        className="mt-2"
                        placeholder={"Подробное описание товара"}
                        value={fullDescription}
                        onChange={e => setFullDescription(e.target.value)}
                    />
                    <Col className='d-flex' style={{textAlign: "center", alignSelf: "flex-end"}}>
                        <Form.Control
                            type='number'
                            className="mt-2"
                            placeholder={"Объем упаковки"}
                            value={volumeProduct}
                            style={{width: '160px'}}
                            onChange={e => setVolumeProduct(e.target.value)}
                        /> <p style={{textAlign: "center", lineHeight: '0px', alignSelf: "flex-end", marginLeft: 10, fontSize: '20px', fontWeight: 400}}>см³</p>
                    </Col>

                    <hr/>
                    <Row className="justify-content-center">
                    <Button className="btn-5"
                                style={{width: '40%', height: 40, fontSize: '18px', fontWeight: 400}}
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
                                    value={i.name}
                                    onChange={(e) => changeOption('name', e.target.value, i.number)}
                                />
                            </Col>
                            <Col md={5}>
                                <Form.Control
                                    type="file"
                                    onChange={(e) => changeOption('img', e.target.files[0], i.number)}
                                />

                            </Col>
                            <Col md={1}>
                                <Button className="btn-2"
                                        style={{width: '10%', fontSize: '18px', fontWeight: 400, color: 'red'}}
                                        onClick={() => removeOption(i.number)}>
                                    X
                                </Button>
                            </Col>
                        </Row>
                    )}

                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={handleClose} style={{fontWeight: 400}}>Закрыть</Button>
                <Button onClick={addProduct} style={{color: '#f3a0d5', fontWeight:400}}>Добавить</Button>
            </Modal.Footer>
        </Modal>
    )
});

export default CreateProduct;