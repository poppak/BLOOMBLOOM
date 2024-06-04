import React, {useContext, useEffect, useState} from 'react';
import {Container, DropdownButton, Row, Dropdown, Button} from "react-bootstrap";
import {Context} from "../index";
import PreorderProductList from "../components/PreorderProductList";
import {fetchCategories, fetchOrders, fetchPreorderProducts, fetchProducts, fetchPurchases} from "../http/productAPI";
import Timer from "../components/Timer";

const Shop = () => {
    const { product } = useContext(Context);
    const {client} = useContext(Context);
    const [loading, setLoading] = useState(true);
    const [selectedCategoryName, setSelectedCategoryName] = useState("preorder");
    const [filteredProducts, setFilteredProducts] = useState([])
    const ProgressBar = ({ percent }) => {
        const progressStyle = {
            width: `${percent}%`,
            alignItems: 'center'
    };

        return (
            <div className="progress-bar">
                <div className="progress-container" style={{display: 'flex', alignItems: 'center'}}>
                    <div className="progress" style={progressStyle}>
                        <div className='progress-text'
                             style={{flex: 1, textAlign: 'center', fontWeight: 400, color: "white"}}>{percent}%
                        </div>
                    </div>

                </div>
            </div>
        );
    };
    const [progress, setProgress] = useState(0);


    useEffect(() => {
        Promise.all([
            fetchCategories(),
            fetchProducts(),
            fetchPurchases(),
            fetchPreorderProducts(),
            fetchOrders()
        ]).then(([categories, products, purchases, preorderProducts, orders]) => {
            product.setCategories(categories);
            product.setProducts(products);
            product.setFilteredProducts(products);
            product.setPurchases(purchases);
            product.setPreorderProducts(preorderProducts);
            client.setOrders(orders);
            setLoading(false);
            const purchase = product.purchases.find(pur => pur.statusPurchase === "Запись открыта")
            const purchaseId = purchase.id

            const order = client.orders.filter(i => i.purchaseId === purchaseId)
            let factSumma = 0
            order.forEach(i => factSumma = factSumma + i.summaOrder)
            let percent = Math.floor(factSumma / purchase.minSumma * 100)
                let currentProgress = 0;
                const interval = setInterval(() => {
                    currentProgress += 1;
                    if (currentProgress > 100 || currentProgress > percent) {
                        clearInterval(interval);
                    } else {
                        setProgress(currentProgress);
                    }
                }, 15);

        }).catch(error => {
            console.error('Error loading data:', error);
            setLoading(false);
        });
    }, [product]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (product.purchases.find(pur => pur.statusPurchase === "Запись открыта")) {
        const handleCategorySelect = (category) => {
            console.log(category.id);
            if (product.selectedCategory && product.selectedCategory.id === category.id) {
                return;}
            product.setSelectedCategory(category);
            filterCategoryProducts(category.id);
            setSelectedCategoryName(category.name);
        }
        if (product.purchases) {
            console.log(product.purchases);
        }
        const purchase = product.purchases.find(pur => pur.statusPurchase === "Запись открыта")
        const purchaseId = purchase.id
        console.log(purchaseId)

        product.preorderProducts.forEach((preorderProduct) => {
            if (preorderProduct.purchaseId === purchaseId) {
                const productToAdd = product.products.find(prod => prod.id === preorderProduct.productId);
                if (productToAdd && !product.preorderedProducts.some(p => p.id === productToAdd.id)) {
                    const extendedProduct = {
                        ...productToAdd,
                        price: preorderProduct.price,
                        purchaseId: preorderProduct.purchaseId
                    };
                    product.setPreorderedProducts([...product.preorderedProducts, extendedProduct]);
                } else if (!productToAdd) {
                    console.log('Продукт с id ' + preorderProduct.productId + ' не найден');
                }
            } else {
                console.log(preorderProduct.id + ' не входит в закупку');
            }
        });
        console.log(product.filteredProducts)
        const filterCategoryProducts = (categoryId) => {
            setFilteredProducts(product.preorderedProducts.filter(product => product.categoryId === categoryId));
            console.log(filteredProducts)
        }

        return (
            <div>
                <Container className='mb-5'>

                    <Row>
                        <h1 style={{textAlign: 'center', marginTop: '4%', marginBottom: '1%'}}>{selectedCategoryName}</h1>
                    </Row>
                    <Row>
                        <h4 style={{width: '30%', marginLeft: '35%', textAlign: "center"}}>
                            <Timer
                                targetDate={purchase.dateFinish}/></h4>
                    </Row>
                    <Row>
                    <DropdownButton id="dropdown-basic-button" title="Категория" style={{fontSize: '14px'}}>
                            {product.categories && product.categories.map(category =>
                                <Dropdown.Item
                                    onClick={() => handleCategorySelect(category)}
                                    key={category.id}
                                    style={{fontWeight: 200}}
                                >
                                    {category.name}
                                </Dropdown.Item>
                            )}
                        </DropdownButton>
                    </Row>
                    <PreorderProductList preorderedProducts={product.preorderedProducts} filteredProducts={filteredProducts}
                                         selectedCategory={selectedCategoryName}/>

                </Container>

                <div style={{
                    position: 'fixed',
                    bottom: 0,
                    width: '100%',
                    backgroundColor: '#bcfe00',
                    padding: '10px 0'
                }}>
                    <Row>
                        <span style={{width: '50%', textAlign: "right", fontWeight: 400}}>Сделай заказ, чтобы закупка состоялась. <a style={{color:"black"}} href="/rules">Подробнее</a></span>
                        <div style={{width: '20%'}}><ProgressBar percent={progress}/></div>
                    </Row>
                </div>
            </div>

        )
            ;
    } else {
        return (<h1>Нет открытой закупки</h1>)
    }


};

export default Shop;