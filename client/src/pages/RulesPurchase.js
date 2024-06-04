import React, {useEffect, useState} from 'react';
import {Button, Container, Image, Row} from "react-bootstrap";
import {Link} from "react-router-dom";
import img from '../img/torriden.jpg'

const RulesPurchase = () => {
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
        let percent = 70
        let currentProgress = 0;
        const interval = setInterval(() => {
            currentProgress += 1;
            if (currentProgress > 100 || currentProgress > percent) {
                clearInterval(interval);
            } else {
                setProgress(currentProgress);
            }
        }, 15);
    }, []);

    return (
        <Container>
            <Row>
                <div style={{width: '40%'}}>
                    <h1 className="mt-5 mb-5" style={{fontWeight: 600, color: '#e97ec6', fontSize: '50px'}}>Участвуйте в
                        совместных закупках BLOOMBLOOM</h1>
                    <span style={{fontSize: '25px', fontWeight: 300}}>Совместная закупка – это возможность оформить предзаказ на уникальные товары из Южной Кореи.
            <br/>Для предзаказа доступны:
            <br/>• лимитированные товары;
            <br/>• бестселлеры корейской косметики;
            <br/>• товары по вкусным ценам.</span>
                    <br/>

                    <Link to="/shop">
                        <Button className='btn-6 mt-5' style={{backgroundColor: '#e97ec6', width: '50%', height: '10%', fontSize: '20px', fontWeight: 600}}>
                            Перейти к покупкам
                        </Button>
                    </Link>

                </div>
                <div className='mt-5'  style={{width: '50%', marginLeft: '10%'}}>
                    <Image style={{width: '100%', height: "auto", marginTop: '20%'}} src={img}></Image>
                </div>

            </Row>
            <Row className="mt-5 mb-5">
                <h1 className="mt-5 mb-3" style={{fontWeight: 600, color: '#e97ec6', fontSize: '34px'}}>Индикатор
                    наполнения закупки</h1>
                <div style={{
                    bottom: 0,
                    width: '100%',
                    backgroundColor: '#bcfe00',
                    padding: '10px 0'
                }}>
                    <Row>
                        <span style={{width: '50%', textAlign: "right", fontWeight: 400}}>Сделай заказ, чтобы закупка состоялась.
                        </span>
                        <div style={{width: '20%'}}><ProgressBar percent={progress}/></div>
                    </Row>
                </div>
                <span className="mt-3" style={{fontSize: '25px', fontWeight: 300}}>
                    Индикатор наполнения отражает процент готовности закупки к выкупу.
                    Оформляя заказы, вы увеличиваете возможность проведения совместной закупки.
                    <span style={{fontWeight: 400}}>Чтобы закупка состоялась, примите участие и сделайте заказ!</span>



                </span>
            </Row>

        </Container>
    );
};

export default RulesPurchase;