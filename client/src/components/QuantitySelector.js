import React, { useState } from 'react';
import {Button, InputGroup, FormControl, Card} from 'react-bootstrap';

const QuantitySelector = () => {
    const [quantity, setQuantity] = useState(1);

    const handleIncrement = () => {
        setQuantity(quantity + 1);
    };

    const handleDecrement = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    return (
        <Card className="mt-3" style={{borderRadius: '70px', width: '110px', height: 50}}>
            <InputGroup>
                <Button className="btn-3" onClick={handleDecrement} style={{fontWeight: 200, width: '35px', fontSize: '20px'}}>–</Button>
                <FormControl value={quantity} readOnly style={{fontWeight: 300, width: '30%', fontSize: '15px', background: 'none', border: 'none', textAlign: 'center', height: 50}}/>
                <Button className="btn-3" onClick={handleIncrement} style={{fontWeight: 200, width: '35px', fontSize: '20px'}}>+</Button>
            </InputGroup>
        </Card>


    );
};

export default QuantitySelector;