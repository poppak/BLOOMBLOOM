import React, {useContext, useEffect, useState} from 'react';
import {check, fetchUsers} from "../../http/userAPI";
import {
    fetchBasketProducts,
    fetchBaskets,
    fetchCategories,
    fetchOptions, fetchOrders, fetchOrdersProduct,
    fetchPreorderProducts,
    fetchProducts,
    fetchPurchases
} from "../../http/productAPI";
import {Context} from "../../index";
import {Modal, Table} from "react-bootstrap";

const MembersList = ({show, onHide, purchase}) => {
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
    console.log(users)
    const orders = client.orders.filter(order => order.purchaseId === purchase.id)
    if (orders) {
        return (
            <Modal show={show}
                   onHide={onHide}
                   size='lg'
                   style={{borderRadius: 0}}>
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter" style={{display: 'flex', alignItems: 'center'}}>
                        Участники закупки
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Table striped bordered hover style={{borderCollapse: 'collapse', borderColor: 'transparent', borderBottom: '1px lightgrey'}}>
                        <thead>
                        <tr style={{textAlign: 'center'}}>
                            <th style={{fontWeight: '400', width: 20}}></th>
                            <th style={{fontWeight: '400', width: 400}}>Имя участника</th>
                            <th style={{fontWeight: '400', width: 400}}>email</th>
                            <th style={{fontWeight: '400', width: 600}}>Заказ</th>
                            <th style={{fontWeight: '400', width: 600}}>Статус заказа</th>
                            <th style={{fontWeight: '400', width: 500}}>Сумма заказа</th>
                        </tr>
                        </thead>
                        <tbody>
                        {orders.sort((a, b) => {
                            const nameA = users.find(u => u.id === a.userId).name.toLowerCase();
                            const nameB = users.find(u => u.id === b.userId).name.toLowerCase();
                            return nameA.localeCompare(nameB);
                        }).map((i, index) => {
                            const name = users.find(u => u.id === i.userId).name;
                            const email = users.find(u => u.id === i.userId).email;
                            const date = new Date(i.createdAt);
                            const month = date.getMonth() + 1;
                            const year = date.getFullYear();
                            return (
                                <tr>
                                    <td style={{textAlign: 'center', fontSize: '16px'}}>{index + 1}</td>
                                    <td>{name}</td>
                                    <td>{email}</td>
                                    <td>Заказ P-{year}{month}{i.id}</td>
                                    <td>{i.statusOrder}</td>
                                    <td>{i.summaOrder}</td>
                                </tr>
                            )
                        })}
                        </tbody>
                    </Table>
                </Modal.Body>
            </Modal>
        );
    }
    console.log(orders)

};

export default MembersList;