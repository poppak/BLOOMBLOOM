import React, {useContext, useState} from 'react';
import {Context} from "../index";
import {Image, Table} from "react-bootstrap";
import UpdateProduct from "./modals/UpdateProduct";
import UpdatePurchase from "./modals/UpdatePurchase";

const PurchaseList = () => {
    const {product} = useContext(Context)
    const purchasesToDisplay = product.filteredProducts.length > 0 ? product.filteredProducts : product.purchases
    const [purchaseVisible, setPurchaseVisible] = useState(false)
    const [selectedPurchaseIndex, setSelectedPurchaseIndex] = useState(null);
    const handlePurchaseClick = (index) => {
        setSelectedPurchaseIndex(index);
        setPurchaseVisible(true);
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
                    <td style={{fontWeight: '400'}}>{purchase.dateStart}</td>
                    <td style={{fontWeight: '400'}}>{purchase.dateFinish}</td>
                    <td>{purchase.status}</td>
                </tr>
            ))}
            </tbody>
            <UpdatePurchase show={purchaseVisible} onHide={() => setPurchaseVisible(false)} selectedPurchase={selectedPurchaseIndex !== null ? purchasesToDisplay[selectedPurchaseIndex] : {}} />
        </Table>

    );
};

export default PurchaseList;