import React, {useContext, useEffect, useState} from 'react';
import {Context} from "../../index";
import {Button, Col, Dropdown, DropdownMenu, DropdownToggle, Form, Image, Modal, Row, Table} from "react-bootstrap";
import SelectProducts from "./SelectProducts";
import {
    createProduct,
    createPurchase,
    fetchCategories, fetchOptions,
    fetchPreorderProduct,
    fetchProducts
} from "../../http/productAPI";
import {values} from "mobx";

const CreatePurchase = ({show, onHide}) => {
    const {product} = useContext(Context)
    useEffect(() => {
        fetchProducts().then(data => product.setProducts(data))
        fetchOptions().then(data => product.setOptions(data))
    }, []);
    const [selectedStatus, setSelectedStatus] = useState('');
    const [productVisible, setProductVisible] = useState(false)
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [preorderProduct, setPreorderProduct] = useState([])
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [minSumma, setMinSumma] = useState('');
    const [factSumma, setFactSumma] = useState('');
    const [planDelivery, setPlanDelivery] = useState('');
    const [factDelivery, setFactDelivery] = useState('');

    const addPreorderProduct = (value, productId) => {
        const op = product.options.find(op => op.productId === productId)
        selectedProducts.map(product => {
            if (product.options) {
                product.options.map(op => {
                    if (op.productId === productId) {
                        const newProduct = {
                            optionId: op.id,
                            productId: productId,
                            price: value,
                            quantity: 0,
                            number: Date.now()
                        };
                        setPreorderProduct(prevProducts => [...prevProducts, newProduct]);
                    }
                });
            }

            if (!op) {
                const newProduct = {
                    productId: productId,
                    price: value,
                    quantity: 0,
                    number: Date.now()
                };
                setPreorderProduct(prevProducts => {
                    const uniqueProducts = new Set(prevProducts.map(product => JSON.stringify(product)));
                    if (!uniqueProducts.has(JSON.stringify(newProduct))) {
                        uniqueProducts.add(JSON.stringify(newProduct));
                        return Array.from(uniqueProducts).map(product => JSON.parse(product));
                    }
                    return prevProducts;
                });
            }
        });
    }
    const handleAddProduct = (productId) => (e) => {
        const finalValue = e.target.value;
        addPreorderProduct(finalValue, productId);
    };
    // const selectPreorderProduct = () => {
    //     setPreorderProduct([...preorderProduct, {optionId: '', productId: '', price: '', number: Date.now()}])
    // }
    console.log(selectedProducts)

    const handleClose = () => {
        setSelectedStatus('')
        setSelectedProducts([])
        onHide();
    };

    const handleSelectCategory = (categoryName) => {
        setSelectedStatus(categoryName);
    };

    let timeoutId;
    const handleEndDateChange = (event) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            const endDate = event.target.value;
            if (endDate) {
                const endDateObj = new Date(endDate);
                setEndDate(endDateObj)
                const startDate = new Date(document.getElementById('startDate').value);
                if (startDate && endDateObj < startDate) {
                    alert('Дата окончания должна быть строго больше даты начала');
                    event.target.value = '';
                    setEndDate('')
                }
            }
        }, 700);
    };
    const handleStartDateChange = (event) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            const startDate = event.target.value;
            if (startDate) {
                const startDateObj = new Date(startDate);
                setStartDate(startDateObj)
                const endDate = new Date(document.getElementById('endDate').value);
                if (endDate && endDate < startDateObj) {
                    alert('Дата окончания должна быть строго больше даты начала');
                    event.target.value = '';
                    setStartDate('')
                }
            }
        }, 700);
    };

    const addPurchase = () => {
        const formData = new FormData()
        formData.append('statusPurchase', selectedStatus)
        formData.append('dateStart', startDate)
        formData.append('dateFinish', endDate)
        formData.append('minSumma', `${minSumma}`)
        if (!isNaN(factSumma) && factSumma !== '') {
            formData.append('factSumma', `${factSumma}`)
        }
        formData.append('planDelivery', `${planDelivery}`)
        if (!isNaN(factDelivery) && factDelivery !== '') {
            formData.append('factDelivery', `${factDelivery}`)
        }

        formData.append('preorderProducts', JSON.stringify(preorderProduct))
        console.log(preorderProduct)
        createPurchase(formData).then(data => onHide())
    }

    return (
        <Modal
            show={show}
            onHide={onHide}
            size="lg"
            centered
        >
            <Modal.Header>
                <Modal.Title id="contained-modal-title-vcenter">
                    Добавить закупку
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Row className="mt-2">
                        <Dropdown style={{width: 170}}>
                            <DropdownToggle style={{fontWeight: 400}}>Статус закупки</DropdownToggle>
                            <DropdownMenu>
                                <Dropdown.Item style={{fontWeight: 200}} onClick={() => handleSelectCategory('Планируется')}>
                                    Планируется
                                </Dropdown.Item>
                                <Dropdown.Item style={{fontWeight: 200}} onClick={() => handleSelectCategory('Запись открыта')}>
                                    Запись открыта
                                </Dropdown.Item>
                                <Dropdown.Item style={{fontWeight: 200}} onClick={() => handleSelectCategory('Запись закрыта')}>
                                    Запись закрыта
                                </Dropdown.Item>
                                <Dropdown.Item style={{fontWeight: 200}} onClick={() => handleSelectCategory('Сбор оплаты')}>
                                    Сбор оплаты
                                </Dropdown.Item>
                                <Dropdown.Item style={{fontWeight: 200}} onClick={() => handleSelectCategory('Заказана')}>
                                    Заказана
                                </Dropdown.Item>
                                <Dropdown.Item style={{fontWeight: 200}} onClick={() => handleSelectCategory('Получена на кор. адресе')}>
                                    Получена на кор. адресе
                                </Dropdown.Item>
                                <Dropdown.Item style={{fontWeight: 200}} onClick={() => handleSelectCategory('Отправлена в РФ')}>
                                    Отправлена в РФ
                                </Dropdown.Item>
                                <Dropdown.Item style={{fontWeight: 200}} onClick={() => handleSelectCategory('Закрыта')}>
                                    Закрыта
                                </Dropdown.Item>
                                <Dropdown.Item style={{fontWeight: 200}} onClick={() => handleSelectCategory('Отменена')}>
                                    Отменена
                                </Dropdown.Item>
                            </DropdownMenu>
                        </Dropdown>
                        <Form.Control style={{width: 200}} placeholder={selectedStatus} readOnly/>
                    </Row>
                    <Row>
                        <Col md={6} className="mt-2" style={{textAlign: 'center', alignItems: 'center', fontWeight: 400}}> Дата начала <Form.Control className="mt-2" type='date' style={{textAlign: 'center', fontWeight: 200}} id="startDate" onBlur={handleStartDateChange}/></Col>
                        <Col md={6} className="mt-2" style={{textAlign: 'center', alignItems: 'center', fontWeight: 400}}> Дата окончания <Form.Control className="mt-2" type='date' style={{textAlign: 'center', fontWeight: 200}} id="endDate" onBlur={handleEndDateChange}/></Col>
                    </Row>
                    <Row>
                        <Col md={6} className="mt-2" style={{textAlign: 'center', alignItems: 'center', fontWeight: 400}}> Минимальная сумма закупки <Form.Control className="mt-2" type='number' style={{textAlign: 'center', fontWeight: 200}} onBlur={e => setMinSumma(e.target.value)}/></Col>
                        <Col md={6} className="mt-2" style={{textAlign: 'center', alignItems: 'center', fontWeight: 400}}> Планируемая сумма доставки до РФ <Form.Control className="mt-2" type='number' style={{textAlign: 'center', fontWeight: 200}}  onBlur={e => setPlanDelivery(e.target.value)}/></Col>
                    </Row>
                    <Row>
                        <Col md={6} className="mt-2" style={{textAlign: 'center', alignItems: 'center', fontWeight: 400}}> Фактическая сумма закупки <Form.Control className="mt-2" type='number' style={{textAlign: 'center', fontWeight: 200}} disabled onBlur={e => setFactSumma(e.target.value)}/></Col>
                        <Col md={6} className="mt-2" style={{textAlign: 'center', alignItems: 'center', fontWeight: 400}}> Фактическая сумма доставки до РФ <Form.Control className="mt-2" type='number' style={{textAlign: 'center', fontWeight: 200}} disabled={selectedStatus !== 'Отправлена в РФ'} onBlur={e => setFactDelivery(e.target.value)}/></Col>
                    </Row>
                    <hr/>
                    <Row className="justify-content-center">
                        <Button className="btn-5"
                                style={{width: '40%', height: 40, fontSize: '18px', fontWeight:400}}
                                onClick={() => {setProductVisible(true)}}
                        >
                            Добавить товар
                        </Button>
                    </Row>
                    <Table striped bordered hover style={{borderCollapse: 'collapse', borderColor: 'transparent', borderBottom: '1px lightgrey'}}>
                        <thead>
                        <tr style={{textAlign: 'center'}}>
                            <th style={{fontWeight: '300', width: 20}}>№</th>
                            <th style={{fontWeight: '300', width: '60px'}}>Фото</th>
                            <th style={{fontWeight: '300', width: 400}}>Наименование</th>
                            <th style={{fontWeight: '300', width: 500}}>Варианты</th>
                            <th style={{fontWeight: '300', width: 500}}>Цена</th>
                        </tr>
                        </thead>
                        <tbody>
                        {selectedProducts.map((product, index) => (
                            <tr key={product.id} style={{fontSize: '18px'}}>
                                <td style={{textAlign: 'center', fontSize: '16px'}}>{index + 1}</td>
                                <td style={{textAlign: 'center'}}><Image width={50} height={50}
                                                                         src={process.env.REACT_APP_API_URL + product.product.img}/></td>
                                <td style={{fontWeight: '400'}}>{product.product.name}</td>
                                <td style={{fontSize: '18px'}}>{product.options && product.options.map(i => i.name + '; ')}</td>
                                <td style={{fontSize: '18px'}}>
                                    <input style={{backgroundColor: 'transparent', borderColor: 'transparent'}} type="number" onBlur={handleAddProduct(product.product.id)}/>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>


                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={handleClose} style={{fontWeight:400}}>Закрыть</Button>
                <Button onClick={addPurchase} style={{color: '#f3a0d5', fontWeight:400}}>Добавить</Button>
            </Modal.Footer>
            <SelectProducts show={productVisible} onHide={() => setProductVisible(false)} selectedProducts={selectedProducts} setSelectedProducts={setSelectedProducts}/>
        </Modal>
    )
};

export default CreatePurchase;