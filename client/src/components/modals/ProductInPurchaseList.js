import React, {useContext, useEffect, useState} from 'react';
import {Context} from "../../index";
import {fetchUsers} from "../../http/userAPI";
import {
    fetchCategories,
    fetchOptions, fetchOrders, fetchOrdersProduct,
    fetchPreorderProducts,
    fetchProducts,
    fetchPurchases
} from "../../http/productAPI";
import {Button, Image, Modal, Table} from "react-bootstrap";
import { utils, writeFile } from 'xlsx';

const ProductInPurchaseList = ({show, onHide, purchase}) => {
    const {client} = useContext(Context)
    const {product} = useContext(Context)
    const [loading, setLoading] = useState(true)
    const [users, setUsers] = useState([]);
    useEffect(() => {
        Promise.all([
            fetchUsers(),
            fetchCategories(),
            fetchProducts(),
            fetchPurchases(),
            fetchPreorderProducts(),
            fetchOptions(),
            fetchOrders(),
            fetchOrdersProduct()
        ]).then(([users, categories, products, purchases, preorderProducts, options, orders, ordersProduct]) => {
            setUsers(users);
            product.setCategories(categories);
            product.setProducts(products);
            product.setFilteredProducts(products);
            product.setPurchases(purchases);
            product.setPreorderProducts(preorderProducts);
            product.setOptions(options);
            client.setOrders(orders);
            client.setOrdersProduct(ordersProduct);
            setLoading(false);
        }).catch(error => {
            console.error('Error loading data:', error);
            setLoading(false);
        });
    }, [product, client]);
    if (loading) {
        return <div>Loading...</div>;
    }

    const preorderProducts = product.preorderProducts.filter(i => i.purchaseId === purchase.id)
    const exportToExcel = () => {
        const ws = utils.table_to_sheet(document.getElementById('products'));
        const wb = utils.book_new();
        utils.book_append_sheet(wb, ws, 'Лист1');
        writeFile(wb, 'Товары.xlsx');
    };
    if (client.orders.find(i => i.purchaseId === purchase.id)) {
        const orders = client.orders.filter(i => i.purchaseId === purchase.id).map(i => i.id)
        const products = client.ordersProduct.filter(i => orders.includes(i.orderId))
        let summa = 0
        const combinedProducts = products.reduce((acc, curr) => {
            const productId = preorderProducts.find(p => p.id === curr.preorderProductId).productId;
            const img = product.products.find(p => p.id === productId).img;
            const name = product.products.find(p => p.id === productId).name;
            const optionId = preorderProducts.find(p => p.id === curr.preorderProductId).optionId;
            let option = '';
            optionId ? option = product.options.find(o => o.id === optionId).name : option = '';
            const price = preorderProducts.find(p => p.id === curr.preorderProductId).price;
            const total = price * curr.quantity;

            const existingProduct = acc.find(p => p.name === name && p.option === option);

            if (existingProduct) {
                existingProduct.quantity += curr.quantity;
                existingProduct.total += total;
            } else {
                acc.push({
                    img: img,
                    name: name,
                    option: option,
                    quantity: curr.quantity,
                    price: price,
                    total: total
                });
            }
            summa = summa + total

            return acc;
        }, []);
        combinedProducts.sort((a, b) => a.name.localeCompare(b.name));

        return (
            <Modal show={show}
                   onHide={onHide}
                   size='lg'
                   style={{borderRadius: 0}}>
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter" style={{display: 'flex', alignItems: 'center'}}>
                        Товары закупки
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Table striped bordered hover style={{borderCollapse: 'collapse', borderColor: 'transparent', borderBottom: '1px lightgrey'}} id='products'>
                        <thead>
                        <tr style={{textAlign: 'center'}}>
                            <th style={{fontWeight: '400', width: 20}}></th>
                            <th style={{fontWeight: '400', width: 400}}>Фото</th>
                            <th style={{fontWeight: '400', width: 600}}>Товар</th>
                            <th style={{fontWeight: '400', width: 400}}>Версия</th>
                            <th style={{fontWeight: '400', width: 400}}>Количество</th>
                            <th style={{fontWeight: '400', width: 600}}>Цена</th>
                            <th style={{fontWeight: '400', width: 500}}>Сумма</th>
                        </tr>
                        </thead>
                        <tbody>
                        {combinedProducts.map((item, index) => (
                            <tr key={index}>
                                <td style={{textAlign: 'center', fontSize: '16px'}}>{index + 1}</td>
                                <td style={{textAlign: 'center'}}><Image width={50} height={50}
                                                                         src={process.env.REACT_APP_API_URL + item.img}/>
                                </td>
                                <td>{item.name}</td>
                                <td>{item.option}</td>
                                <td>{item.quantity}</td>
                                <td>{item.price}</td>
                                <td>{item.total}</td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                    <div style={{textAlign: "center"}}> Сумма закупки: <span style={{fontWeight: '400'}}> {summa} р.</span></div>
                </Modal.Body>
                <Modal.Footer><Button className='btn-2' onClick={() => exportToExcel()}>Экспорт</Button></Modal.Footer>
            </Modal>
        );
    }

};

export default ProductInPurchaseList;