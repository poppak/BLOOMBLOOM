import React, {useContext, useEffect, useState} from 'react';
import {Context} from "../../index";
import {Button, Col, Dropdown, DropdownMenu, DropdownToggle, Form, Image, Modal, Row, Table} from "react-bootstrap";
import SelectProducts from "./SelectProducts";
import purchaseList from "../PurchaseList";
import {
    createPreorderProduct,
    createPurchase,
    deleteBasketProduct, deletePreorderProduct,
    fetchBasketProducts,
    fetchProducts,
    fetchPurchases, updateOrder,
    updatePurchase
} from "../../http/productAPI";
import Notice from "./Notice";
import MembersList from "./MembersList";
import ProductInPurchaseList from "./ProductInPurchaseList";
import {TfiClose} from "react-icons/tfi";

const UpdatePurchase = ({show, onHide, selectedPurchase }) => {
    const {product} = useContext(Context)
    const {client} = useContext(Context)
    useEffect(() => {
        fetchPurchases().then(data => product.setPurchases(data))
        fetchProducts().then(data => {
            product.setProducts(data);
        })
    }, []);
    const [selectedStatus, setSelectedStatus] = useState('');
    const [selectedBaseCost, setSelectedBaseCost] = useState('');
    const [productVisible, setProductVisible] = useState(false)
    const [noticeVisible, setNoticeVisible] = useState(false)
    const [memberListVisible, setMemberListVisible] = useState(false)
    const [productInPurchaseListVisible, setProductInPurchaseListVisible] = useState(false)
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [minSumma, setMinSumma] = useState('');
    const [factSumma, setFactSumma] = useState('');
    const [planDelivery, setPlanDelivery] = useState('');
    const [factDelivery, setFactDelivery] = useState('');
    const [preorderProduct, setPreorderProduct] = useState([])
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
    console.log(selectedProducts)
    console.log(products)
    const handleClose = () => {
        setSelectedStatus('')
        setSelectedProducts([])
        onHide();
    };

    const handleSelectCategory = (categoryName) => {
        setSelectedStatus(categoryName);
    };
    const updatePur = {
        statusPurchase: selectedStatus ? selectedStatus : selectedPurchase.statusPurchase,
        dateStart: startDate ? startDate : selectedPurchase.dateStart,
        dateFinish: endDate ? endDate : selectedPurchase.dateFinish,
        minSumma: minSumma ? `${minSumma}` : selectedPurchase.minSumma,
        factSumma: factSumma ? `${factSumma}` : selectedPurchase.factSumma,
        planDelivery: planDelivery ? `${planDelivery}` : selectedPurchase.planDelivery,
        factDelivery: factDelivery ? `${factDelivery}` : selectedPurchase.factDelivery,
        baseCost: selectedBaseCost ? selectedBaseCost : selectedPurchase.baseCost,
    }
    const handleSave = () => {
        preorderProduct.forEach(i => {
            const formData = new FormData()
            formData.append('purchaseId', selectedPurchase.id)
            formData.append('productId', i.productId)
            if (i.optionId) {
                formData.append('optionId', i.optionId)
            }
            formData.append('price', i.price)
            createPreorderProduct(formData).then()
        })
        const orders = client.orders.filter(order => order.purchaseId === selectedPurchase.id)
        orders.map(i => {
            if (updatePur.statusPurchase === 'Сбор оплаты' && i.statusOrder === 'Записан') {
                return updateOrder(i.id, i, 'Ожидает оплаты');
            }
            if (updatePur.statusPurchase === 'Заказана' && i.statusOrder === 'Оплачен') {
                return updateOrder(i.id, i, 'Заказан у поставщика');
            }
            if (updatePur.statusPurchase === 'Получена на кор. адресе' && i.statusOrder === 'Заказан у поставщика') {
                return updateOrder(i.id, i, 'Получен на кор. адресе');
            }
            if (updatePur.statusPurchase === 'Отправлена в РФ' && i.statusOrder === 'Получен на кор. адресе') {
                return updateOrder(i.id, i, 'Отправлен в РФ');
            }
            if (updatePur.statusPurchase === 'Рассылка заказов' && i.statusOrder === 'Отправлен в РФ') {
                return updateOrder(i.id, i, 'Ожидает оформления доставки по РФ');
            }
            if (updatePur.statusPurchase === 'Отменена') {
                return updateOrder(i.id, i, 'Отменен');
            }
        });

        if ((updatePur.statusPurchase === selectedPurchase.statusPurchase)
            && (updatePur.dateStart === selectedPurchase.dateStart)
            && (updatePur.dateFinish === selectedPurchase.dateFinish)
            && (updatePur.minSumma === selectedPurchase.minSumma)
            && (updatePur.factSumma === selectedPurchase.factSumma)
            && (updatePur.planDelivery === selectedPurchase.planDelivery)
            && (updatePur.factDelivery === selectedPurchase.factDelivery)
            && (updatePur.baseCost === selectedPurchase.baseCost)
            && (updatePur.statusPurchase === selectedPurchase.statusPurchase)
        ) {

        } else {
            updatePurchase(selectedPurchase.id, updatePur).then()
        }
        setNoticeVisible(true)

    };

    const handleSelectBaseCost = (baseName) => {
        setSelectedBaseCost(baseName);
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

    console.log(products)
    const formatDateToYYYYMMDD = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    const addPreorderProduct = (value, productId) => {
        const existingProductIndex = preorderProduct.findIndex(product => product.productId === productId);

        if (existingProductIndex !== -1) {
            // Обновляем цену существующего продукта
            const updatedProducts = [...preorderProduct];
            updatedProducts[existingProductIndex].price = value;
            setPreorderProduct(updatedProducts);
        } else {
            const op = product.options.find(op => op.productId === productId)
            selectedProducts.map(product => {
                if (product.options) {
                    product.options.map(op => {
                        if (op.productId === productId) {
                            const newProduct = {
                                optionId: op.id,
                                productId: productId,
                                price: value,
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
    }
    const handleAddProduct = (productId) => (e) => {
        const finalValue = e.target.value;
        addPreorderProduct(finalValue, productId);
    };
    console.log(preorderProduct)
    const deletePreorderPr = (purchaseId, productId) => {
        deletePreorderProduct(purchaseId, productId)
            .then((data) => {
                console.log("Продукт успешно удален", data);
            })
            .catch((error) => {
                console.error("Ошибка при удалении продукта", error);
            });
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
                    Закупка от {formatDateToYYYYMMDD(selectedPurchase.dateStart)}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    {selectedPurchase.statusPurchase !== "Планируется" ?
                        <Row>
                            <Button className="btn-5" style={{width: '49%', fontSize: '18px', fontWeight:400}} onClick={() => setMemberListVisible(true)}>Список участников</Button>
                            <Button className="btn-5" style={{width: '49%', fontSize: '18px', fontWeight:400}} onClick={() => setProductInPurchaseListVisible(true)}>Список товаров</Button>
                        </Row>
                        :
                        <div></div>
                    }
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
                                <Dropdown.Item style={{fontWeight: 200}} onClick={() => handleSelectCategory('Получена в РФ')}>
                                    Получена в РФ
                                </Dropdown.Item>
                                <Dropdown.Item style={{fontWeight: 200}} onClick={() => handleSelectCategory('Рассылка заказов')}>
                                    Рассылка заказов
                                </Dropdown.Item>
                                <Dropdown.Item style={{fontWeight: 200}} onClick={() => handleSelectCategory('Закрыта')}>
                                    Закрыта
                                </Dropdown.Item>
                                <Dropdown.Item style={{fontWeight: 200}} onClick={() => handleSelectCategory('Отменена')}>
                                    Отменена
                                </Dropdown.Item>
                            </DropdownMenu>
                        </Dropdown>
                        <Form.Control style={{width: 200}} placeholder={selectedStatus ? selectedStatus : selectedPurchase.statusPurchase} readOnly />                    </Row>
                    <Row className="mt-2">
                        <Dropdown style={{width: 250}}>
                            <DropdownToggle style={{fontWeight: 500}}>База распределения затрат</DropdownToggle>
                            <DropdownMenu>
                                <Dropdown.Item style={{fontWeight: 200}} onClick={() => handleSelectBaseCost('Сумма заказа')}>
                                    Сумма заказа
                                </Dropdown.Item>
                                <Dropdown.Item style={{fontWeight: 200}} onClick={() => handleSelectBaseCost('Объем товаров')}>
                                    Объем товаров
                                </Dropdown.Item>
                                <Dropdown.Item style={{fontWeight: 200}} onClick={() => handleSelectBaseCost('Количество товаров')}>
                                    Количество товаров
                                </Dropdown.Item>
                            </DropdownMenu>
                        </Dropdown>
                        <Form.Control style={{width: 200}} placeholder={selectedBaseCost ? selectedBaseCost : selectedPurchase.baseCost} readOnly/>
                    </Row>
                    <Row>
                        <Col md={6} className="mt-2" style={{textAlign: 'center', alignItems: 'center', fontWeight: 400}}> Дата начала <Form.Control className="mt-2" type='date' style={{textAlign: 'center', fontWeight: 200}} id="startDate" onChange={handleStartDateChange} value={formatDateToYYYYMMDD(selectedPurchase.dateStart)}/></Col>
                        <Col md={6} className="mt-2" style={{textAlign: 'center', alignItems: 'center', fontWeight: 400}}> Дата окончания <Form.Control className="mt-2" type='date' style={{textAlign: 'center', fontWeight: 200}} id="endDate" onChange={handleEndDateChange} value={formatDateToYYYYMMDD(selectedPurchase.dateFinish)}/></Col>
                    </Row>
                    <Row>
                        <Col md={6} className="mt-2" style={{textAlign: 'center', alignItems: 'center', fontWeight: 400}}> Минимальная сумма закупки <Form.Control className="mt-2" type='number' style={{textAlign: 'center', fontWeight: 200}} value={selectedPurchase.minSumma} onBlur={e => setMinSumma(e.target.value)}/></Col>
                        <Col md={6} className="mt-2" style={{textAlign: 'center', alignItems: 'center', fontWeight: 400}}> Планируемая сумма доставки до РФ <Form.Control className="mt-2" type='number' style={{textAlign: 'center', fontWeight: 200}} value={selectedPurchase.planDelivery} onBlur={e => setPlanDelivery(e.target.value)}/></Col>
                    </Row>
                    <Row>
                        <Col md={6} className="mt-2" style={{textAlign: 'center', alignItems: 'center', fontWeight: 400}}> Фактическая сумма закупки <Form.Control className="mt-2" type='number' style={{textAlign: 'center', fontWeight: 200}} disabled value={selectedPurchase.factSumma} onBlur={e => setFactSumma(e.target.value)}/></Col>
                        <Col md={6} className="mt-2" style={{textAlign: 'center', alignItems: 'center', fontWeight: 400}}> Фактическая сумма доставки до РФ <Form.Control className="mt-2" type='number' style={{textAlign: 'center', fontWeight: 200}} disabled={selectedStatus !== 'Отправлена в РФ'} value={selectedPurchase.factDelivery} onBlur={e => setFactDelivery(e.target.value)}/></Col>
                    </Row>
                    <hr/>
                    {selectedPurchase.statusPurchase === 'Планируется' ?
                        <Row className="justify-content-center">
                            <Button className="btn-5"
                                    style={{width: '40%', height: 40, fontSize: '18px', fontWeight:400}}
                                    onClick={() => setProductVisible(true)}
                            >
                                Добавить товар
                            </Button>
                        </Row>
                        : ''
                    }

                    <Table striped bordered hover style={{borderCollapse: 'collapse', borderColor: 'transparent', borderBottom: '1px lightgrey'}}>
                        <thead>
                        <tr style={{textAlign: 'center'}}>
                            <th style={{fontWeight: '300', width: 20}}>№</th>
                            <th style={{fontWeight: '300', width: '60px'}}>Фото</th>
                            <th style={{fontWeight: '300', width: 400}}>Наименование</th>
                            <th style={{fontWeight: '300', width: 500}}>Варианты</th>
                            <th style={{fontWeight: '300', width: 200}}>Цена</th>
                            {selectedPurchase.statusPurchase === 'Планируется' ?
                                <th style={{fontWeight: '300', width: 100}}></th>
                                : ''
                            }
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
                                    <input style={{backgroundColor: 'transparent', borderColor: 'transparent'}} type="number" defaultValue={purchaseProduct.find(pr => pr.productId === product.id).price}  readOnly={selectedPurchase.statusPurchase !== 'Планируется'}/>
                                </td>
                                {selectedPurchase.statusPurchase === 'Планируется' && (
                                    <td><Col className='col-md-1 d-flex align-items-center'>
                                        <div className="circle" style={{ width: 40 }} onClick={() => deletePreorderPr(selectedPurchase.id, product.id)}>
                                            <TfiClose style={{ width: '20px', color: 'grey' }} />
                                        </div>
                                    </Col></td>
                                )}
                            </tr>
                        ))}
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
                <Button onClick={() => handleSave()} style={{color: '#f3a0d5', fontWeight:400}}>Обновить</Button>
            </Modal.Footer>
            <SelectProducts show={productVisible} onHide={() => setProductVisible(false)} selectedProducts={selectedProducts} setSelectedProducts={setSelectedProducts} productsPur={products} optionsPur={options}/>
            <Notice show={noticeVisible} onHide={() => setNoticeVisible(false)} name='Елизавета' status={selectedStatus}/>
            <ProductInPurchaseList show={productInPurchaseListVisible} onHide={() => setProductInPurchaseListVisible(false)} purchase={selectedPurchase}></ProductInPurchaseList>
            <MembersList show={memberListVisible} onHide={() => setMemberListVisible(false)} purchase={selectedPurchase}></MembersList>
        </Modal>
    )
};
export default UpdatePurchase;