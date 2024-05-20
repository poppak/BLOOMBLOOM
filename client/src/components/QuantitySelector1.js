import React, { useState } from 'react';
import { Button, InputGroup, FormControl, Card } from 'react-bootstrap';
import {TfiMinus, TfiPlus} from "react-icons/tfi";

const QuantitySelector1 = ({ id, onUpdate, quantitie }) => {
    const [quantity, setQuantity] = useState(quantitie);

    const handleIncrement = () => {
        setQuantity(quantity + 1);
        onUpdate(id, quantity + 1);
    };

    const handleDecrement = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
            onUpdate(id, quantity - 1);
        }
    };

    return (
        <div className="d-flex justify-content-between align-items-center">
            <div className='circle1' onClick={handleDecrement}><TfiMinus style={{width: '9px', color: 'grey'}}/></div>
            <FormControl value={quantity} readOnly style={{
                fontWeight: 300,
                width: '40px',
                fontSize: '15px',
                background: 'none',
                border: 'none',
                textAlign: 'center',
                height: 50
            }}/>
            <div className='circle1' onClick={handleIncrement}><TfiPlus style={{width: '9px', color: 'grey'}}/></div>
        </div>


    );
};

export default QuantitySelector1;