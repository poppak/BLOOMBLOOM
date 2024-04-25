import React, {useContext, useEffect, useState} from 'react';
import {Context} from "../index";
import {Image, Table} from "react-bootstrap";
import UpdateProduct from "./modals/UpdateProduct";
import UpdatePurchase from "./modals/UpdatePurchase";
import {fetchCategories, fetchPreorderProducts, fetchProducts, fetchPurchases} from "../http/productAPI";

const PurchaseList = () => {
    const {product} = useContext(Context)
    const [loading, setLoading] = useState(true);
    const purchasesToDisplay = product.purchases
    const [purchaseVisible, setPurchaseVisible] = useState(false)
    const [selectedPurchaseIndex, setSelectedPurchaseIndex] = useState(null);
    useEffect(() => {
        Promise.all([
            fetchPurchases(),
        ]).then(([purchases]) => {
            product.setPurchases(purchases);
            setLoading(false);
        }).catch(error => {
            console.error('Error loading data:', error);
            setLoading(false);
        });
    }, [product]);
    if (loading) {
        return <div>Loading...</div>;
    }

    const handlePurchaseClick = (index) => {
        setSelectedPurchaseIndex(index);
        setPurchaseVisible(true);
    };
    const formatDate = (date) => {
        const d = new Date(date);
        const day = d.getDate().toString().padStart(2, '0');
        const month = (d.getMonth() + 1).toString().padStart(2, '0');
        const year = d.getFullYear();

        return `${day}.${month}.${year}`;
    };
    return (
        <Table striped bordered hover style={{borderCollapse: 'collapse', borderColor: 'transparent', borderBottom: '1px lightgrey'}}>
            <thead>
            <tr style={{textAlign: 'center'}}>
                <th style={{fontWeight: '300', width: 20}}>№</th>
                <th style={{fontWeight: '300'}}>Дата начала</th>
                <th style={{fontWeight: '300'}}>Дата окончания</th>
                <th style={{fontWeight: '300'}}>Статус</th>
            </tr>
            </thead>
            <tbody>
            {purchasesToDisplay.map((purchase, index) => (
                <tr key={purchase.id} style={{fontSize: '20px'}} onClick={() => handlePurchaseClick(index)}>
                    <td style={{textAlign: 'center', fontSize: '16px'}}>{index + 1}</td>
                    <td style={{fontWeight: '400'}}>{formatDate(purchase.dateStart)}</td>
                    <td style={{fontWeight: '400'}}>{formatDate(purchase.dateFinish)}</td>
                    <td>{purchase.statusPurchase}</td>
                </tr>
            ))}
            </tbody>
            <UpdatePurchase show={purchaseVisible} onHide={() => setPurchaseVisible(false)} selectedPurchase={selectedPurchaseIndex !== null ? purchasesToDisplay[selectedPurchaseIndex] : {}} />
        </Table>

    );
};

export default PurchaseList;