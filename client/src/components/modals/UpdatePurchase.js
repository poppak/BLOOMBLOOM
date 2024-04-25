import React, {useContext, useEffect, useState} from 'react';
import {Context} from "../../index";
import {Button, Col, Dropdown, DropdownMenu, DropdownToggle, Form, Image, Modal, Row, Table} from "react-bootstrap";
import SelectProducts from "./SelectProducts";
import purchaseList from "../PurchaseList";
import {fetchProducts, fetchPurchases} from "../../http/productAPI";

const UpdatePurchase = ({show, onHide, selectedPurchase }) => {
    const {product} = useContext(Context)
    useEffect(() => {
        fetchPurchases().then(data => product.setPurchases(data))
        fetchProducts().then(data => {
            product.setProducts(data);
        })
    }, []);
    const [selectedStatus, setSelectedStatus] = useState('');
    const [productVisible, setProductVisible] = useState(false)
    const [selectedProducts, setSelectedProducts] = useState([]);
    const purchaseProduct = product.preorderProducts.filter(prod => prod.purchaseId === selectedPurchase.id)
    console.log(purchaseProduct)
    const products = purchaseProduct.map((pur) => {
        return product.products.find(pr => pr.id === pur.productId);
    }).filter((value, index, self) => self.indexOf(value) === index);

    console.log(products)
    const options = purchaseProduct.map((pur) => {
        const option = product.options.find(op => op.id === pur.optionId);
        if (option) {
            return option;
        }
        return null
    })
    console.log(options)
    const handleClose = () => {
        setSelectedStatus('')
        setSelectedProducts([])
        onHide();
    };

    const handleSelectCategory = (categoryName) => {
        setSelectedStatus(categoryName);
    };
    const handleSave = () => {
        // Логика сохранения изменений на сервере
        // Например, вызов метода для обновления закупки

    };
    let timeoutId;
    const handleEndDateChange = (event) => {
        clearTimeout(timeoutId); // Очищаем предыдущий таймаут, если он был установлен

        timeoutId = setTimeout(() => {
            const endDate = event.target.value;

            if (endDate) {
                const endDateObj = new Date(endDate);
                const startDate = new Date(document.getElementById('startDate').value);

                if (startDate && endDateObj < startDate) {
                    alert('Дата окончания должна быть строго больше даты начала');
                    event.target.value = ''; // Очищаем поле ввода даты окончания
                }
            }
        }, 700);
    }

    console.log(selectedPurchase.dateStart)
    const formatDateToYYYYMMDD = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
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
                    Редактирование закупки*
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
                        <Form.Control style={{width: 200}} placeholder={selectedStatus ? selectedStatus : selectedPurchase.statusPurchase} readOnly />
                    </Row>
                    <Row>
                        <Col md={6} className="mt-2" style={{textAlign: 'center', alignItems: 'center', fontWeight: 400}}> Дата начала <Form.Control className="mt-2" type='date' style={{textAlign: 'center', fontWeight: 200}} id="startDate" onChange={handleEndDateChange} value={formatDateToYYYYMMDD(selectedPurchase.dateStart)}/></Col>
                        <Col md={6} className="mt-2" style={{textAlign: 'center', alignItems: 'center', fontWeight: 400}}> Дата окончания <Form.Control className="mt-2" type='date' style={{textAlign: 'center', fontWeight: 200}} id="endDate" onChange={handleEndDateChange} value={formatDateToYYYYMMDD(selectedPurchase.dateFinish)}/></Col>
                    </Row>
                    <Row>
                        <Col md={6} className="mt-2" style={{textAlign: 'center', alignItems: 'center', fontWeight: 400}}> Минимальная сумма закупки <Form.Control className="mt-2" type='number' style={{textAlign: 'center', fontWeight: 200}} value={selectedPurchase.minSumma}/></Col>
                        <Col md={6} className="mt-2" style={{textAlign: 'center', alignItems: 'center', fontWeight: 400}}> Планируемая сумма доставки до РФ <Form.Control className="mt-2" type='number' style={{textAlign: 'center', fontWeight: 200}} value={selectedPurchase.planDelivery}/></Col>
                    </Row>
                    <Row>
                        <Col md={6} className="mt-2" style={{textAlign: 'center', alignItems: 'center', fontWeight: 400}}> Фактическая сумма закупки <Form.Control className="mt-2" type='number' style={{textAlign: 'center', fontWeight: 200}} disabled value={selectedPurchase.factSumma}/></Col>
                        <Col md={6} className="mt-2" style={{textAlign: 'center', alignItems: 'center', fontWeight: 400}}> Фактическая сумма доставки до РФ <Form.Control className="mt-2" type='number' style={{textAlign: 'center', fontWeight: 200}} disabled={selectedStatus !== 'Отправлена в РФ'} value={selectedPurchase.factDelivery}/></Col>
                    </Row>
                    <hr/>
                    <Row className="justify-content-center">
                        <Button className="btn-5"
                                style={{width: '40%', height: 40, fontSize: '18px', fontWeight:400}}
                                onClick={() => setProductVisible(true)}
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
                        {products.map((product, index) => (
                            <tr key={product.id} style={{fontSize: '18px'}}>
                                <td style={{textAlign: 'center', fontSize: '16px'}}>{index + 1}</td>
                                <td style={{textAlign: 'center'}}><Image width={50} height={50}
                                                                         src={process.env.REACT_APP_API_URL + product.img}/></td>
                                <td style={{fontWeight: '400'}}>{product.name}</td>
                                <td style={{fontSize: '18px'}}>{options.map(i => i !== null && i.productId === product.id ? i.name + '; ' : '')}</td>
                                <td style={{fontSize: '18px'}}>
                                    <input style={{backgroundColor: 'transparent', borderColor: 'transparent'}} type="number" defaultValue={purchaseProduct.find(pr => pr.productId === product.id).price}/>
                                </td>
                            </tr>
                        ))}
                        {selectedProducts.map((product, index) => (
                            <tr key={product.id} style={{fontSize: '18px'}}>
                                <td style={{textAlign: 'center', fontSize: '16px'}}>{index + 1}</td>
                                <td style={{textAlign: 'center'}}><Image width={50} height={50}
                                                                         src={product.product.img}/></td>
                                <td style={{fontWeight: '400'}}>{product.product.name}</td>
                                <td style={{fontSize: '18px'}}>{product.options && product.options.map(i => i.name + '; ')}</td>
                                <td style={{fontSize: '18px'}}>
                                    <input style={{backgroundColor: 'transparent', borderColor: 'transparent'}} type="number"/>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>


                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={handleClose} style={{fontWeight:400}}>Закрыть</Button>
                <Button onClick={onHide} style={{color: '#f3a0d5', fontWeight:400}}>Добавить</Button>
            </Modal.Footer>
            <SelectProducts show={productVisible} onHide={() => setProductVisible(false)} selectedProducts={selectedProducts} setSelectedProducts={setSelectedProducts}/>
        </Modal>
    )
};
export default UpdatePurchase;